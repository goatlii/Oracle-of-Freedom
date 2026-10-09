import type { StudioLang } from "@/lib/studio-locale";

export function studioCopy(lang: StudioLang) {
  const en = lang === "en";
  return {
    language: en ? "Language" : "Idioma",
    nav: {
      today: en ? "Today" : "Hoy",
      inquiries: en ? "Inquiries" : "Solicitudes",
      calendar: en ? "Calendar" : "Agenda",
      prices: en ? "Prices" : "Precios",
      logout: en ? "Log out" : "Salir",
      menu: en ? "Studio" : "Estudio",
    },
    install: en ? "Install the app" : "Instalar la app",
    installing: en ? "Installing…" : "Instalando…",
    installHint: en
      ? "Chrome did not open the installer. Open the ⋮ menu and tap Install app."
      : "Chrome no abrió el instalador. Abre el menú ⋮ y pulsa Instalar app.",
    offline: en
      ? "Offline. The studio cannot refresh."
      : "Sin conexión. No se puede actualizar el estudio.",
    login: {
      title: en ? "Studio" : "Estudio",
      intro: en
        ? "Enter the password to see inquiries, the calendar, prices and delivery times."
        : "Escribe la contraseña para ver solicitudes, la agenda, los precios y los plazos.",
      password: en ? "Password" : "Contraseña",
      enter: en ? "Enter" : "Entrar",
      checking: en ? "Checking…" : "Comprobando…",
      closed: en
        ? "This page stays closed until ADMIN_PASSWORD is added in Vercel and the site is published again."
        : "Esta página sigue cerrada hasta añadir ADMIN_PASSWORD en Vercel y volver a publicar el sitio.",
    },
    home: {
      title: en ? "Today" : "Hoy",
      fresh: (count: number) =>
        en
          ? count === 1
            ? "1 new inquiry"
            : `${count} new inquiries`
          : count === 1
            ? "1 solicitud nueva"
            : `${count} solicitudes nuevas`,
      noFresh: en ? "No new inquiries." : "No hay solicitudes nuevas.",
      seeAll: en ? "See all" : "Ver todas",
      agenda: en ? "Today’s calendar" : "Agenda de hoy",
      empty: en ? "Nothing waiting today." : "Nada pendiente hoy.",
      allDay: en ? "All day" : "Todo el día",
      noName: en ? "No name" : "Sin nombre",
      next: en ? "Up next" : "Lo siguiente",
      rest: en ? "Rest of today" : "El resto del día",
      moreInquiries: (count: number) =>
        en
          ? count === 1
            ? "1 new inquiry"
            : `${count} new inquiries`
          : count === 1
            ? "1 solicitud nueva"
            : `${count} solicitudes nuevas`,
    },
    inquiries: {
      title: en ? "Inquiries" : "Solicitudes",
      one: en ? "Inquiry" : "Solicitud",
      filter: en ? "Filter" : "Filtro",
      filters: {
        new: en ? "New" : "Nuevas",
        replied: en ? "Done" : "Hechas",
        archived: en ? "Archive" : "Archivo",
      },
      badge: {
        new: en ? "New" : "Nueva",
        replied: en ? "Replied" : "Respondida",
        archived: en ? "Archived" : "Archivada",
      },
      empty: en ? "Nothing in this list." : "No hay solicitudes en esta lista.",
      back: en ? "Back to the list" : "Volver a la lista",
      email: "Email",
      phone: en ? "Phone" : "Teléfono",
      noPhone: en ? "Not given" : "No lo dejó",
      date: en ? "Date" : "Fecha",
      place: en ? "Place" : "Lugar",
      clientLanguage: en ? "Language" : "Idioma",
      budget: en ? "Budget" : "Presupuesto",
      noStory: en ? "No story written." : "No escribió una historia.",
      whatsappMissing: en ? "WhatsApp · no phone" : "WhatsApp · sin teléfono",
      replied: en ? "Mark replied" : "Marcar respondida",
      archive: en ? "Archive" : "Archivar",
      restore: en ? "Move back to new" : "Devolver a nuevas",
      flexible: en ? "Flexible date" : "Fecha flexible",
      noDate: en ? "No date" : "Sin fecha",
      whatsapp: (name: string, service: string) =>
        en
          ? `Hello ${name}, this is Agota from Oracle of Freedom. I read your message about ${service}.`
          : `Hola ${name}, soy Agota de Oracle of Freedom. He leído tu mensaje sobre ${service}.`,
      languages: {
        en: en ? "English" : "Inglés",
        es: en ? "Spanish" : "Español",
        lt: en ? "Lithuanian" : "Lituano",
        pt: en ? "Portuguese" : "Portugués",
      } as Record<string, string>,
    },
    prices: {
      title: en ? "Prices" : "Precios",
      heading: en ? "Prices and delivery" : "Precios y plazos",
      panes: {
        prices: en ? "Prices" : "Precios",
        delivery: en ? "Delivery" : "Plazos",
        promos: en ? "Promotions" : "Promociones",
      },
      groups: {
        portraits: en ? "Portraits" : "Retratos",
        elopements: "Elopements",
        retreats: en ? "Retreats" : "Retiros",
        festivals: en ? "Festivals" : "Festivales",
        places: en ? "Places" : "Lugares",
      },
      kind: {
        photo: en ? "Photo" : "Foto",
        video: en ? "Video" : "Vídeo",
        combo: en ? "Photo and film" : "Foto y vídeo",
        addon: "Extra",
      },
      storage: {
        blob: en
          ? "Saves appear on the site in a few seconds. The price is shared; the delivery line can differ by language."
          : "Se ve en la web en unos segundos. El precio es el mismo; el plazo puede cambiar en cada idioma.",
        local: en
          ? "This computer only. The public site keeps the starting prices and delivery lines until Vercel Blob is connected."
          : "Solo este ordenador. La web pública sigue con los precios y los plazos de partida hasta conectar Vercel Blob.",
        readonly: en
          ? "Saving is off until Vercel Blob is connected. Visitors still see the starting prices and delivery lines."
          : "No se puede guardar hasta conectar Vercel Blob. Quien visita sigue viendo los precios y los plazos de partida.",
      },
      locales: {
        en: en ? "English" : "Inglés",
        es: en ? "Spanish" : "Español",
        pt: en ? "Portuguese" : "Portugués",
      },
      shared: en ? "Shared delivery times" : "Plazos compartidos",
      sharedHelp: en
        ? "These short phrases fill the gaps on every page. Leave one as it is to keep today’s wording."
        : "Estas frases cortas rellenan los huecos de la web. Déjala igual para conservar el texto de hoy.",
      timings: {
        artistGalleryWeeks: {
          label: en ? "Photo galleries" : "Galerías de fotos",
          hint: en
            ? "Portraits, press kits, live sets and festival photo galleries"
            : "Retratos, kits de prensa, sets en directo y galerías de festival",
        },
        artistFilmWeeks: {
          label: en ? "Artist films and reels" : "Películas y reels",
          hint: en
            ? "Cards that use this phrase. A card with its own sentence, such as the music video, stays as written."
            : "Las fichas que usan esta frase. Una ficha con su propia frase, como el videoclip, se queda como está.",
        },
        elopementGalleryWeeks: {
          label: en ? "Elopement photographs" : "Fotos de elopement",
          hint: en
            ? "The gallery time on elopement and small-wedding photos"
            : "El plazo de la galería en fotos de elopement y boda pequeña",
        },
        elopementFilmWeeks: {
          label: en ? "Elopement films" : "Películas de elopement",
          hint: en
            ? "Elopement film and the small-wedding highlight"
            : "La película de elopement y el resumen de la boda pequeña",
        },
        expressPhotoDays: {
          label: en ? "Express photographs" : "Fotos exprés",
          hint: en ? "The rushed photo phrase, such as ~7 days" : "La frase de fotos urgentes, por ejemplo ~7 días",
        },
        expressFilmDays: {
          label: en ? "Express film" : "Película exprés",
          hint: en ? "The rushed film phrase, such as 10–14 days" : "La frase de película urgente, por ejemplo 10–14 días",
        },
      },
      fromPlus: (amount: string | number) =>
        en ? `Shown on the site as from €${amount}+` : `En la web se ve desde €${amount}+`,
      fromRange: (amount: string | number, to: string | number) =>
        en ? `Shown on the site as from €${amount}–${to}` : `En la web se ve desde €${amount}–${to}`,
      quoteOnly: en ? "Quote only" : "Solo presupuesto",
      eurosFor: (name: string) => (en ? `Euros for ${name}` : `Euros de ${name}`),
      visible: en ? "Show" : "Visible",
      deliveryLine: en ? "Delivery line" : "Plazo de entrega",
      noDelivery: en ? "No delivery line on this card" : "Sin plazo en esta ficha",
      saved: en ? "Saved. The site updates in a few seconds." : "Guardado. La web se actualiza en unos segundos.",
      saving: en ? "Saving…" : "Guardando…",
      save: en ? "Save prices and delivery" : "Guardar precios y plazos",
      promos: en ? "Promotions" : "Promociones",
      promosHelp: en
        ? "A live promotion strikes the old price and disappears after the end date."
        : "Una promoción viva tacha el precio anterior y desaparece al pasar la fecha.",
      noPromos: en ? "There are no promotions yet." : "Todavía no hay promociones.",
      promoStatus: {
        live: en ? "Live" : "Viva",
        scheduled: en ? "Scheduled" : "Programada",
        ended: en ? "Ended" : "Terminada",
        off: en ? "Off" : "Apagada",
      },
      code: (value: string) => (en ? `code ${value}` : `código ${value}`),
      edit: en ? "Edit" : "Editar",
      delete: en ? "Delete" : "Borrar",
      editPromo: en ? "Edit promotion" : "Editar promoción",
      newPromo: en ? "New promotion" : "Nueva promoción",
      name: en ? "Name" : "Nombre",
      discount: en ? "Discount" : "Descuento",
      percent: en ? "Percent" : "Porcentaje",
      euros: en ? "Euros" : "Euros",
      appliesTo: en ? "Applies to" : "Se aplica a",
      allSessions: en ? "Every session" : "Todas las sesiones",
      starts: en ? "Starts" : "Empieza",
      ends: en ? "Ends" : "Termina",
      codeOptional: en ? "Code (optional)" : "Código (opcional)",
      bannerEn: en ? "English notice (optional)" : "Aviso en inglés (opcional)",
      bannerEs: en ? "Spanish notice (optional)" : "Aviso en español (opcional)",
      bannerPt: en ? "Portuguese notice (optional)" : "Aviso en portugués (opcional)",
      activate: en ? "Turn this promotion on" : "Activar esta promoción",
      updatePromo: en ? "Update promotion" : "Actualizar promoción",
      createPromo: en ? "Create promotion" : "Crear promoción",
      cancel: en ? "Cancel" : "Cancelar",
    },
    calendar: {
      title: en ? "Calendar" : "Agenda",
      intro: en
        ? "A dashed line is on hold. A terracotta edge means two bookings overlap."
        : "La línea discontinua es una cita en espera. El borde terracota avisa de un cruce.",
      storage: {
        blob: en
          ? "Saved in the private calendar. This screen is not published on the site."
          : "Guardado en el calendario privado. Esta pantalla no se publica en la web.",
        local: en
          ? "Saved on this computer only. This screen is not published on the site."
          : "Guardado solo en este ordenador. Esta pantalla no se publica en la web.",
        readonly: en
          ? "Saving is off until Vercel Blob is connected."
          : "No se puede guardar hasta conectar Vercel Blob.",
      },
      upcoming: en ? "Upcoming" : "Próximas",
      previous: en ? "Previous" : "Anterior",
      next: en ? "Next" : "Siguiente",
      today: en ? "Today" : "Hoy",
      dayCount: (label: string, count: number) =>
        en
          ? `${label}, ${count === 1 ? "1 booking" : `${count} bookings`}`
          : `${label}, ${count === 1 ? "1 cita" : `${count} citas`}`,
      newBooking: en ? "New booking" : "Nueva cita",
      emptyDay: en ? "Nothing this day." : "Nada este día.",
      overlap: en ? "Overlaps another booking." : "Se cruza con otra cita.",
      settings: en ? "Booking settings" : "Ajustes de reservas",
      editBooking: en ? "Edit booking" : "Editar cita",
      close: en ? "Close" : "Cerrar",
      another: en ? "Create another" : "Crear otra",
      titleField: en ? "Title" : "Título",
      type: en ? "Type" : "Tipo",
      status: en ? "Status" : "Estado",
      date: en ? "Date" : "Fecha",
      allDay: en ? "All day" : "Todo el día",
      starts: en ? "Starts" : "Empieza",
      ends: en ? "Ends" : "Termina",
      with: en ? "With" : "Con",
      contact: en ? "Contact" : "Contacto",
      place: en ? "Place" : "Lugar",
      note: en ? "Note" : "Nota",
      clash: (names: string) =>
        en
          ? `Overlaps ${names}. You can save it anyway.`
          : `Se cruza con ${names}. Puedes guardarla igual.`,
      saved: en ? "Saved." : "Guardada.",
      saving: en ? "Saving…" : "Guardando…",
      saveChanges: en ? "Save changes" : "Guardar cambios",
      saveBooking: en ? "Save booking" : "Guardar cita",
      delete: en ? "Delete" : "Borrar",
      kind: {
        meeting: en ? "Meeting" : "Reunión",
        session: en ? "Session" : "Sesión",
        event: en ? "Event" : "Evento",
      },
      bookingStatus: {
        hold: en ? "On hold" : "En espera",
        confirmed: en ? "Confirmed" : "Confirmada",
        done: en ? "Done" : "Hecha",
        cancelled: en ? "Cancelled" : "Cancelada",
      },
    },
    settings: {
      title: en ? "Settings" : "Ajustes",
      back: en ? "Back to the calendar" : "Volver a la agenda",
      viewSite: en ? "View the site" : "Ver el sitio",
      saved: en ? "Settings saved." : "Ajustes guardados.",
      copy: en ? "Copy" : "Copiar",
      copied: en ? "Copied" : "Copiado",
      hours: en ? "Hours" : "Horario",
      page: en ? "Booking page" : "Página de reservas",
      pageHelpBefore: en ? "Choose what can be booked at " : "Elige lo que se puede reservar en ",
      pageHelpAfter: en ? ". Times are Lisbon time." : ". Las horas son de Lisboa.",
      types: en ? "Booking types" : "Tipos de cita",
      visible: en ? "Show" : "Visible",
      remove: en ? "Remove" : "Quitar",
      nameLocale: (code: string) => (en ? `Name · ${code}` : `Nombre · ${code}`),
      descriptionLocale: (code: string) => (en ? `Description · ${code}` : `Descripción · ${code}`),
      minutes: en ? "Minutes" : "Minutos",
      type: en ? "Type" : "Tipo",
      addType: en ? "Add a booking type" : "Añadir tipo de cita",
      week: en ? "Weekly hours" : "Horario de la semana",
      opens: en ? "Opens" : "Abre",
      closes: en ? "Closes" : "Cierra",
      daysAhead: en ? "Days open ahead" : "Días abiertos por delante",
      notice: en ? "Minimum notice · hours" : "Aviso mínimo · horas",
      buffer: en ? "Buffer · minutes" : "Margen · minutos",
      usualPlace: en ? "Usual place" : "Lugar habitual",
      saving: en ? "Saving…" : "Guardando…",
      save: en ? "Save settings" : "Guardar ajustes",
      start: en ? "Start" : "Iniciar",
      close: en ? "Close" : "Cerrar",
      googleConnected: en ? "Google Calendar connected." : "Google Calendar conectado.",
      googleMissing: en
        ? "Tap Start and paste the Client ID and the Client secret."
        : "Pulsa Iniciar y pega el Client ID y el Client secret.",
      googleError: en
        ? "Google Calendar could not connect. Check the details and try again."
        : "No se pudo conectar Google Calendar. Revisa los datos y vuelve a intentarlo.",
      connected: (account: string, summary: string) =>
        en
          ? `Connected${account ? ` as ${account}` : ""}. New bookings are written to ${summary}.`
          : `Conectado${account ? ` como ${account}` : ""}. Las citas nuevas se escriben en ${summary}.`,
      googleIntro: en
        ? "Tap Start. The names and the return address are ready to edit."
        : "Pulsa Iniciar. Los nombres y la dirección de vuelta ya se pueden cambiar.",
      projectOpen: en ? "Open" : "Abre",
      projectAfter: en
        ? "and create a project. Use this name, or change it:"
        : "y crea un proyecto. Usa este nombre, o cámbialo:",
      projectName: en ? "Project name" : "Nombre del proyecto",
      enableApi: en
        ? "In that project, open APIs & Services, then Library, search for Google Calendar API and click Enable."
        : "En ese proyecto, abre APIs y servicios, luego Biblioteca, busca Google Calendar API y pulsa Habilitar.",
      consent: en
        ? "Open APIs & Services, then OAuth consent screen. Choose External, add the Google account of the calendar and save."
        : "Abre APIs y servicios, luego Pantalla de consentimiento de OAuth. Elige Externo, añade la cuenta de Google del calendario y guarda.",
      clientBefore: en
        ? "Open Credentials, then Create credentials, then OAuth client ID. Choose Web application. Use this name, or change it:"
        : "Abre Credenciales, luego Crear credenciales, luego ID de cliente de OAuth. Elige Aplicación web. Usa este nombre, o cámbialo:",
      clientName: en ? "OAuth client name" : "Nombre del cliente OAuth",
      redirectHelp: en
        ? "Under Authorized redirect URIs, add the address below exactly as it is written."
        : "En URI de redireccionamiento autorizados, añade la dirección de abajo tal como está escrita.",
      redirect: en ? "Authorized return address" : "Dirección de vuelta autorizada",
      pasteClientId: en ? "Paste the Client ID" : "Pega el Client ID",
      secretSaved: en
        ? "Already saved. Paste a new one only to replace it."
        : "Ya está guardado. Pega uno nuevo solo para cambiarlo.",
      pasteSecret: en ? "Paste the Client secret" : "Pega el Client secret",
      googleSaved: en
        ? "Google details saved. Tap Connect Google Calendar and sign in."
        : "Datos de Google guardados. Pulsa Conectar Google Calendar e inicia sesión.",
      saveDetails: en ? "Save these details" : "Guardar estos datos",
      connect: en ? "Connect Google Calendar" : "Conectar Google Calendar",
      calendarOf: en ? "Calendar for the bookings" : "Calendario de las citas",
      primary: en ? " · primary" : " · principal",
      useCalendar: en ? "Use this calendar" : "Usar este calendario",
      disconnect: en ? "Disconnect Google" : "Desconectar Google",
      ical: en ? "iCal subscription" : "Suscripción iCal",
      icalIntro: en
        ? "Tap Start, then copy the private address into your calendar app."
        : "Pulsa Iniciar y copia la dirección privada en tu app de calendario.",
      calendarName: en ? "Calendar name" : "Nombre del calendario",
      privateAddress: en ? "Private address" : "Dirección privada",
      appleMac: en
        ? "Apple Calendar on a Mac: File, then New Calendar Subscription. Paste the private address. If it asks for a name, use the one above."
        : "Calendario de Apple en un Mac: Archivo, luego Nueva suscripción a calendario. Pega la dirección privada. Si pide un nombre, usa el de arriba.",
      iphone: en
        ? "iPhone: Settings, then Calendar, then Accounts, then Add Account, then Other, then Add Subscribed Calendar. Paste the private address."
        : "iPhone: Ajustes, luego Calendario, luego Cuentas, luego Añadir cuenta, luego Otra, luego Añadir calendario suscrito. Pega la dirección privada.",
      outlook: en
        ? "Outlook: Add calendar, then Subscribe from web. Paste the private address and use the name above."
        : "Outlook: Añadir calendario, luego Suscribirse desde la web. Pega la dirección privada y usa el nombre de arriba.",
      otherGoogle: en
        ? "Another Google account: Settings, then Add calendar, then From URL. Paste the private address. Google can take several hours to show new bookings."
        : "Otra cuenta de Google: Ajustes, luego Añadir calendario, luego Desde URL. Pega la dirección privada. Google puede tardar varias horas en mostrar las citas nuevas.",
      subscribe: en ? "Subscribe" : "Suscribirse",
      newLink: en ? "Create another private link" : "Crear otro enlace privado",
    },
    errors: {
      password: en ? "The password does not match." : "La contraseña no coincide.",
      wholeEuros: (label: string) =>
        en ? `Enter a whole-euro price for ${label}.` : `Escribe un precio en euros enteros para ${label}.`,
      prices: en ? "The prices could not be saved." : "No se pudieron guardar los precios.",
      promoName: en ? "Give the promotion a name." : "Ponle un nombre a la promoción.",
      promoAmount: en ? "The discount has to be a whole number." : "El descuento tiene que ser un número entero.",
      promoPercent: en ? "The percent can be 90 at most." : "El porcentaje puede ser como mucho 90.",
      promoFixed: en ? "That euro discount is too large." : "Ese descuento en euros es demasiado grande.",
      promoDates: en ? "Enter the start date and the end date." : "Pon la fecha de inicio y la de fin.",
      promoOrder: en ? "The end date has to be the same as or after the start." : "La fecha final tiene que ser igual o posterior a la de inicio.",
      promoTargets: en ? "Choose the sessions, or mark all of them." : "Elige las sesiones o marca todas.",
      promoCode: en ? "The code can use letters, numbers and hyphens." : "El código puede usar letras, números y guiones.",
      promoSave: en ? "The promotion could not be saved." : "No se pudo guardar la promoción.",
      bookingKind: en ? "Choose meeting, session or event." : "Elige reunión, sesión o evento.",
      bookingStatus: en ? "Choose a status." : "Elige un estado.",
      bookingTitle: en ? "Write a title." : "Escribe un título.",
      bookingWhen: en ? "Check the date and the times." : "Revisa la fecha y las horas.",
      bookingEnd: en ? "The end time has to be after the start." : "La hora final tiene que ser posterior a la de inicio.",
      bookingFull: en ? "The calendar is full. Delete an old booking." : "La agenda está llena. Borra una cita antigua.",
      bookingMissing: en ? "That booking is no longer on the calendar." : "Esa cita ya no está en la agenda.",
      bookingSave: en ? "The booking could not be saved." : "No se pudo guardar la cita.",
      googlePartial: (message: string) =>
        en
          ? `Saved in the studio. Google did not update: ${message}`
          : `Guardada en el estudio. Google no se actualizó: ${message}`,
      settingsInvalid: en ? "These calendar settings are not valid." : "Estos ajustes de la agenda no son válidos.",
      settingsCheck: en
        ? "Check the booking types, the hours and the booking limits."
        : "Revisa los tipos de cita, el horario y los límites de reserva.",
      settingsSave: en ? "The settings did not save." : "No se pudieron guardar los ajustes.",
      clientId: en
        ? "Paste the Google Cloud Client ID into the Client ID field."
        : "Pega el Client ID de Google Cloud en la casilla Client ID.",
      redirectUrl: en ? "The return address has to be a full web address." : "La dirección de vuelta tiene que ser una dirección web completa.",
      redirectPath: en
        ? "The return address has to end in /api/admin/google/callback."
        : "La dirección de vuelta tiene que terminar en /api/admin/google/callback.",
      secretSave: en ? "The Client secret could not be saved." : "No se pudo guardar el Client secret.",
      secretMissing: en
        ? "Paste the Google Cloud Client secret into the Client secret field."
        : "Pega el Client secret de Google Cloud en la casilla Client secret.",
      googleSave: en ? "The Google setup was not saved." : "No se guardó la configuración de Google.",
      timingPhrase: (label: string, example: string) =>
        en
          ? `Keep “${label}” to a short phrase, like “${example}”.`
          : `Deja «${label}» en una frase corta, como «${example}».`,
      deliveryLine: (locale: string, label: string) =>
        en
          ? `Shorten the ${locale} delivery line for ${label}.`
          : `Acorta el plazo en ${locale} de ${label}.`,
      localeName: {
        en: en ? "English" : "inglés",
        es: en ? "Spanish" : "español",
        pt: en ? "Portuguese" : "portugués",
      },
    },
  };
}

export type StudioCopy = ReturnType<typeof studioCopy>;

export function inquiryWhen(when: string, t: StudioCopy) {
  if (when === "Fecha flexible" || when === "Flexible") return t.inquiries.flexible;
  if (when.startsWith("Flexible, ")) return `${t.inquiries.flexible}, ${when.slice("Flexible, ".length)}`;
  if (when === "Sin fecha") return t.inquiries.noDate;
  return when;
}
