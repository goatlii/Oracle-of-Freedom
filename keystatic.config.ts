import { config, fields, singleton } from "@keystatic/core";

const localized = fields.object({
  en: fields.text({ label: "English", multiline: true }),
  es: fields.text({ label: "Español", multiline: true }),
  pt: fields.text({ label: "Português (PT)", multiline: true }),
});

const packageItem = fields.object({
  id: fields.text({ label: "ID" }),
  group: fields.text({ label: "Page group", description: "portraits, elopements, retreats, festivals or places" }),
  kind: fields.text({ label: "Kind", description: "photo, video or combo" }),
  label: fields.text({ label: "Name in the price editor" }),
  from: fields.integer({ label: "From (EUR)", validation: { isRequired: false } }),
  unit: fields.text({ label: "Unit", description: "day, night, month, or leave empty" }),
  inquiry: fields.text({ label: "Inquiry service id" }),
  loved: fields.checkbox({ label: "Most loved" }),
  custom: fields.checkbox({ label: "Custom quote, no public price" }),
  personalize: fields.checkbox({ label: "Show “Personalize your session”" }),
  addon: fields.checkbox({
    label: "Add-on",
    description: "Shown in the Express / add-ons row, not as a session, film or combo card.",
  }),
  compare: fields.array(fields.text({ label: "Package id" }), {
    label: "Compare with",
    description: "For a combo, the photo and film ids booked separately.",
  }),
});

const repo = process.env.KEYSTATIC_GITHUB_REPO;
const github = process.env.KEYSTATIC_STORAGE === "github" && repo?.includes("/");

export default config({
  storage: github ? { kind: "github", repo: repo as `${string}/${string}` } : { kind: "local" },
  ui: {
    brand: { name: "Oracle of Freedom" },
    navigation: ["settings", "packages", "testimonials", "videos"],
  },
  singletons: {
    settings: singleton({
      label: "Settings",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        brand: fields.text({ label: "Brand" }),
        domain: fields.text({ label: "Domain" }),
        siteUrl: fields.text({ label: "Site URL" }),
        email: fields.text({ label: "Email" }),
        instagram: fields.text({ label: "Instagram handle" }),
        instagramUrl: fields.text({ label: "Instagram URL" }),
        founder: fields.text({ label: "Founder" }),
        whatsappE164: fields.text({
          label: "WhatsApp number",
          description: "Digits only, with country code. This is the only place the floating button reads.",
        }),
        whatsappDisplay: fields.text({ label: "WhatsApp display" }),
        whatsappIsPlaceholder: fields.checkbox({ label: "Number is still a placeholder" }),
        baseArea: fields.text({
          label: "Base area",
          description: "English phrase used in travel notes: the Algarve and the coast up to Lisbon. Spanish and Portuguese name the same region in the copy files.",
        }),
        depositPercent: fields.text({ label: "Deposit" }),
        languagesSpoken: fields.text({
          label: "Languages spoken",
          description: "English phrase on the About page. Spanish and Portuguese name the same languages in the copy files. This is not the site language switcher.",
        }),
        elopementGalleryWeeks: fields.text({
          label: "Elopement photo gallery timing",
          description: "Token {weeks}. Photos only — elopements and small weddings.",
        }),
        artistGalleryWeeks: fields.text({
          label: "Artist / portrait photo gallery timing",
          description: "Token {artistWeeks}. Photos only — portraits and artist galleries.",
        }),
        elopementFilmWeeks: fields.text({
          label: "Elopement film timing",
          description: "Token {filmWeeks}. Film and photo+film for elopements and small weddings.",
        }),
        artistFilmWeeks: fields.text({
          label: "Artist / portrait film timing",
          description: "Token {artistFilmWeeks}. Film and photo+film for portraits and artists.",
        }),
        expressPhotoDays: fields.text({
          label: "Express photo timing",
          description: "Token {expressPhoto}. Rush window for photographs.",
        }),
        expressFilmDays: fields.text({
          label: "Express film timing",
          description: "Token {expressFilm}. Rush window for film and photo+film.",
        }),
        pricesAreProposals: fields.checkbox({ label: "Prices still need confirmation" }),
        heroImageId: fields.text({ label: "Desktop hero image id" }),
        mobileHeroImageId: fields.text({ label: "Mobile hero image id" }),
        aboutImageId: fields.text({ label: "About image id" }),
        doorPeopleId: fields.text({ label: "People door image id" }),
        doorExperiencesId: fields.text({ label: "Experiences door image id" }),
        doorPlacesId: fields.text({ label: "Places door image id" }),
      },
    }),
    packages: singleton({
      label: "Packages",
      path: "content/packages",
      format: { data: "json" },
      schema: {
        confirmBeforeLaunch: fields.checkbox({ label: "Prices are proposals" }),
        currency: fields.text({ label: "Currency" }),
        items: fields.array(packageItem, {
          label: "Packages",
          itemLabel: (props) => props.fields.label.value || props.fields.id.value,
        }),
      },
    }),
    testimonials: singleton({
      label: "Testimonials",
      path: "content/testimonials",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            id: fields.text({ label: "ID" }),
            placeholder: fields.checkbox({ label: "Still a placeholder" }),
            quote: localized,
          }),
          { label: "Quotes", itemLabel: (props) => props.fields.id.value },
        ),
      },
    }),
    videos: singleton({
      label: "Videos",
      path: "content/videos",
      format: { data: "json" },
      schema: {
        note: fields.text({ label: "Editor note", multiline: true }),
        items: fields.array(
          fields.object({
            id: fields.text({ label: "ID" }),
            platform: fields.text({ label: "Platform", description: "instagram or youtube" }),
            url: fields.text({ label: "URL" }),
            youtubeId: fields.text({ label: "YouTube id", description: "Only for YouTube" }),
            posterId: fields.text({ label: "Poster image id" }),
            verify: fields.checkbox({ label: "Still needs a match check" }),
          }),
          { label: "Films", itemLabel: (props) => props.fields.id.value },
        ),
      },
    }),
  },
});
