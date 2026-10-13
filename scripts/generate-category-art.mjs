// Genera el arte de la escena de categorías con Codex (`codex exec`, generación
// de imágenes de la cuenta Codex) y lo optimiza en public/images/categorias/.
//
//   char-<id>.webp  personaje con fondo transparente
//   bg-<id>.webp    fondo de cancha propio de la categoría
//   bg-base.webp    cancha neutra (estado inicial)
//
// El primer personaje (AM Adultos) sirve de referencia de uniforme, luz y encuadre
// para los demás, así la fila se ve como una sola sesión de fotos.
//
// Uso:
//   CODEX_BIN=/ruta/codex.exe node scripts/generate-category-art.mjs [id ...]
//   node scripts/generate-category-art.mjs --optimize <carpeta-con-png>   (solo optimiza)

import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/images/categorias";
const RAW_DIR = join(tmpdir(), "accion-futbol-art");
const CODEX = process.env.CODEX_BIN ?? "codex";
const GENERATED = join(homedir(), ".codex", "generated_images");
const CONCURRENCY = 4;
const REFERENCE_ID = "char-am-adultos";

// Uniforme real de Acción Fútbol: camiseta blanca con vivos naranjos, short negro.
const KIT =
  "white short-sleeve jersey with vivid orange trim on the collar and sleeves and a small plain orange shield emblem on the chest, black shorts with an orange side stripe, white socks, black football boots";
const TRANSPARENT = "Portrait orientation 2:3 (1024x1536), PNG with a fully TRANSPARENT background (no backdrop, no floor, no shadow).";
const reference = (who, pose) =>
  `${TRANSPARENT} Full-body photorealistic sports campaign photo of ${who}, ${pose}, standing facing camera at a slight three-quarter angle, whole body visible from head to boots, centered with small margin. Football training kit: ${KIT}. No readable text, no numbers, no sponsor. Soft key light from front-left and a subtle warm rim light, sharp focus, natural skin texture.`;
const character = (who, pose) =>
  `${TRANSPARENT} The attached image is a style and wardrobe reference: match EXACTLY the same football kit (${KIT}), the same lighting, camera distance and full-body framing. Generate a DIFFERENT person: ${who}, ${pose}. Whole body visible from head to boots, centered with small margin, photorealistic sports campaign photo. No readable text, no numbers.`;
const pitch = (moment) =>
  `Landscape orientation, as wide as possible (16:9 or wider). Cinematic wide photograph of an empty artificial-turf football pitch in Las Condes, Santiago de Chile, with the snow-capped Andes mountains in the distance, ${moment}. Low camera angle at pitch level, shallow depth of field, rich film color grade, no people, no text, no logos.`;

const JOBS = {
  [REFERENCE_ID]: reference("a fit Chilean man around 42 years old with a short salt-and-pepper beard", "arms crossed, warm confident smile"),
  "char-kids": character("a cheerful 8-year-old Chilean girl with a ponytail (child proportions)", "one foot resting on top of a football, big smile"),
  "char-pro-jovenes": character("a focused athletic 16-year-old Chilean teenage boy", "holding a football at his hip, determined look"),
  "char-femenino": character("a confident fit Chilean woman around 32 years old with tied-back dark hair", "holding a football under one arm, confident smile"),
  "char-pm-adultos": character("a strong Chilean man around 30 years old with short dark hair and a black headband", "standing with one foot on a football, hands on hips"),
  "bg-base": pitch("at blue hour twilight, stadium floodlights just turning on, deep moody shadows, subtle warm orange accents"),
  "bg-kids": pitch("on a bright sunny Saturday morning, colorful training cones and small kids goals on the grass, warm cheerful light, clear blue sky"),
  "bg-pro-jovenes": pitch("at golden hour dusk, tactical training mannequins and agility poles on the pitch, intense backlit sun flare, elite academy atmosphere"),
  "bg-femenino": pitch("on a crisp clear Saturday morning, soft bright light, dew on the grass, a single ball resting near the penalty spot"),
  "bg-am-adultos": pitch("at dawn 6:30 am, sunrise glowing pink and orange behind the Andes, light mist over the grass, floodlights still on"),
  "bg-pm-adultos": pitch("at night 9 pm, powerful white stadium floodlights, dramatic light beams, dark sky, wet turf reflections"),
};

function codexGenerate(id, prompt, refImage) {
  return new Promise((resolve, reject) => {
    const work = join(RAW_DIR, ".work", id);
    mkdirSync(work, { recursive: true });
    const args = ["exec", "--skip-git-repo-check", "--json", "--color", "never", "-s", "read-only", "-C", work];
    if (refImage) args.push("-i", refImage);
    // Prompt por stdin (sin argumento posicional): -i acepta varios archivos y se lo tragaría.
    const instructions = `Generate exactly ONE image with your image generation tool. Do not write code or run commands. ${prompt}\nAfter generating, reply only with DONE.`;
    const child = spawn(CODEX, args, { stdio: ["pipe", "pipe", "inherit"] });
    child.stdin.on("error", () => {}); // si codex sale antes de leer, el error real llega en "close"
    child.stdin.end(instructions);
    let thread = null;
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
      thread ??= out.match(/"thread_id"\s*:\s*"([^"]+)"/)?.[1] ?? null;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const dir = thread ? join(GENERATED, thread) : null;
      if (!dir || !existsSync(dir)) return reject(new Error(`codex terminó (${code}) sin imagen`));
      const [latest] = readdirSync(dir)
        .filter((f) => f.endsWith(".png"))
        .map((f) => join(dir, f))
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
      if (!latest) return reject(new Error("no se encontró la imagen generada"));
      const raw = join(RAW_DIR, `${id}.png`);
      copyFileSync(latest, raw);
      resolve(raw);
    });
  });
}

async function optimize(id, rawPath) {
  const isCharacter = id.startsWith("char-");
  const pipeline = isCharacter
    ? sharp(rawPath).trim({ threshold: 1 }).resize({ height: 1400, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 })
    : sharp(rawPath).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 74 });
  await pipeline.toFile(join(OUT_DIR, `${id}.webp`));
}

async function runPool(ids, worker) {
  const queue = [...ids];
  let failed = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const id = queue.shift();
        try {
          await worker(id);
          console.log(`✓ ${id}`);
        } catch (error) {
          failed++;
          console.error(`✗ ${id}: ${error.message}`);
        }
      }
    }),
  );
  return failed;
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(RAW_DIR, { recursive: true });
const argv = process.argv.slice(2);

if (argv[0] === "--optimize") {
  const dir = argv[1];
  if (!dir || !existsSync(dir)) {
    console.error("Uso: node scripts/generate-category-art.mjs --optimize <carpeta-con-png>");
    process.exit(1);
  }
  const ids = readdirSync(dir).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
  process.exit((await runPool(ids, (id) => optimize(id, join(dir, `${id}.png`)))) ? 1 : 0);
}

const ids = Object.keys(JOBS).filter((id) => !argv.length || argv.includes(id));
const refRaw = join(RAW_DIR, `${REFERENCE_ID}.png`);
if (ids.includes(REFERENCE_ID)) {
  try {
    await optimize(REFERENCE_ID, await codexGenerate(REFERENCE_ID, JOBS[REFERENCE_ID]));
    console.log(`✓ ${REFERENCE_ID} (referencia)`);
  } catch (error) {
    console.error(`✗ ${REFERENCE_ID}: ${error.message} — los demás personajes se generan sin referencia`);
  }
}
const rest = ids.filter((id) => id !== REFERENCE_ID);
const failed = await runPool(rest, async (id) => {
  const ref = id.startsWith("char-") && existsSync(refRaw) ? refRaw : undefined;
  await optimize(id, await codexGenerate(id, JOBS[id], ref));
});
process.exit(failed ? 1 : 0);
