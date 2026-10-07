import { config, fields, singleton } from "@keystatic/core";

const localized = fields.object({
  en: fields.text({ label: "English", multiline: true }),
  es: fields.text({ label: "Español", multiline: true }),
  pt: fields.text({ label: "Português (PT)", multiline: true }),
});

const packageItem = fields.object({
  id: fields.text({ label: "ID" }),
  group: fields.text({ label: "Page group", description: "portraits, elopements, retreats, festivals or places" }),
  kind: fields.text({ label: "Kind", description: "photo, video, combo or addon" }),
  label: fields.text({ label: "Name in the price editor" }),
  from: fields.integer({ label: "From (EUR)", validation: { isRequired: false } }),
  to: fields.integer({
    label: "Guide range up to (EUR)",
    description: "Optional. With From, the public price reads as a range, such as from €75–100. Leave empty for a single from-price.",
    validation: { isRequired: false },
  }),
  plus: fields.checkbox({
    label: "Open-ended from price",
    description: "Show from €…+ instead of a closed range.",
  }),
  unit: fields.text({ label: "Unit", description: "day, night, month, or leave empty" }),
  inquiry: fields.text({ label: "Inquiry service id" }),
  loved: fields.checkbox({ label: "Most loved" }),
  custom: fields.checkbox({ label: "Custom quote, no public price" }),
  personalize: fields.checkbox({ label: "Show “Personalize your session”" }),
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
          label: "Elopement / wedding photo timing",
          description: "Photographs for elopements and small weddings. Used as {weeks}.",
        }),
        artistGalleryWeeks: fields.text({
          label: "Portrait / artist photo timing",
          description: "Photographs for portraits and artists. Used as {artistWeeks}.",
        }),
        elopementFilmWeeks: fields.text({
          label: "Elopement / wedding film timing",
          description: "Film and photo+film collections for elopements and small weddings. Used as {filmWeeks}.",
        }),
        artistFilmWeeks: fields.text({
          label: "Portrait / artist film timing",
          description: "Film and photo+film collections for portraits and artists. Used as {artistFilmWeeks}.",
        }),
        expressPhotoDays: fields.text({
          label: "Express photo timing",
          description: "Paid rush window for photographs. Used as {expressPhoto}.",
        }),
        expressFilmDays: fields.text({
          label: "Express film / combo timing",
          description: "Paid rush window for film and photo+film. Used as {expressFilm}.",
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
            name: fields.text({
              label: "Attribution",
              description: "Name and place, for example India, Ireland. Leave empty on placeholders.",
              validation: { isRequired: false },
            }),
            shoot: fields.object({
              en: fields.text({ label: "Shoot label (English)", validation: { isRequired: false } }),
              es: fields.text({ label: "Shoot label (Español)", validation: { isRequired: false } }),
              pt: fields.text({ label: "Shoot label (Português)", validation: { isRequired: false } }),
            }),
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
