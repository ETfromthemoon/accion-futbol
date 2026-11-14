export type CampaignConfig = {
  enabled: boolean;
  startsAt: string;
  endsAt: string;
  frequencyDays: number;
  title: string;
  message: string;
  ctaLabel: string;
  /** A section anchor such as #inscripcion or a complete HTTPS URL. */
  ctaHref: string;
};

// Example summer promotion. Replace its copy and dates before enabling it.
// Keep disabled until the offer has been approved and the real dates are known.
export const CAMPAIGN: CampaignConfig = {
  enabled: false,
  startsAt: "",
  endsAt: "",
  frequencyDays: 14,
  title: "Este verano, vuelve a la cancha",
  message: "Conoce los programas de Acción Fútbol y encuentra tu próximo equipo.",
  ctaLabel: "Quiero conocer los programas",
  ctaHref: "#inscripcion",
};

export function isCampaignActive(config: CampaignConfig, now = new Date()): boolean {
  if (!config.enabled || !Number.isFinite(now.getTime())) return false;
  const startsAt = Date.parse(config.startsAt);
  const endsAt = Date.parse(config.endsAt);
  return Number.isFinite(startsAt) && Number.isFinite(endsAt) && startsAt <= now.getTime() && now.getTime() < endsAt;
}

export function isSafeCampaignHref(href: string): boolean {
  if (href.startsWith("#") && href.length > 1) return true;
  try {
    return new URL(href).protocol === "https:";
  } catch {
    return false;
  }
}
