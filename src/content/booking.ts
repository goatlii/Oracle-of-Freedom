import type { Locale } from "@/i18n/routing";

export type BookingCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  dek: string;
  chooseType: string;
  chooseTime: string;
  yourDetails: string;
  duration: string;
  loading: string;
  unavailable: string;
  name: string;
  email: string;
  note: string;
  notePlaceholder: string;
  consent: string;
  submit: string;
  sending: string;
  back: string;
  successTitle: string;
  successBody: string;
  download: string;
  again: string;
  error: string;
  rate: string;
};

export const bookingCopy: Record<Locale, BookingCopy> = {
  en: {
    metaTitle: "Book a call · Oracle of Freedom",
    metaDescription: "Choose a time to meet photographer and filmmaker Agota Urbikaite.",
    eyebrow: "A moment to meet",
    title: "Book time with Agota",
    dek: "Choose what you need and pick a free time. Times are shown in Lisbon time.",
    chooseType: "1. Choose a meeting",
    chooseTime: "2. Choose a time",
    yourDetails: "3. Your details",
    duration: "minutes",
    loading: "Looking for free times…",
    unavailable: "There are no free times in the next few weeks. Write to me and we’ll find one.",
    name: "Your name",
    email: "Email",
    note: "Anything Agota should know?",
    notePlaceholder: "A little about your idea…",
    consent: "I agree that my details can be used to arrange this meeting.",
    submit: "Confirm booking",
    sending: "Booking…",
    back: "Choose another time",
    successTitle: "You’re booked",
    successBody: "Your time is saved. Keep the calendar file below and check your email for the details.",
    download: "Add to my calendar",
    again: "Book another time",
    error: "That time could not be booked. Please choose another one.",
    rate: "Too many attempts. Please wait a few minutes and try again.",
  },
  es: {
    metaTitle: "Reserva una llamada · Oracle of Freedom",
    metaDescription: "Elige una hora para conocer a la fotógrafa y videógrafa Agota Urbikaite.",
    eyebrow: "Un momento para conocernos",
    title: "Reserva tiempo con Agota",
    dek: "Elige lo que necesitas y una hora libre. Los horarios se muestran en la hora de Lisboa.",
    chooseType: "1. Elige una cita",
    chooseTime: "2. Elige una hora",
    yourDetails: "3. Tus datos",
    duration: "minutos",
    loading: "Buscando horas libres…",
    unavailable: "No hay horas libres en las próximas semanas. Escríbeme y encontraremos una.",
    name: "Tu nombre",
    email: "Email",
    note: "¿Hay algo que Agota deba saber?",
    notePlaceholder: "Cuéntame un poco sobre tu idea…",
    consent: "Acepto que mis datos se usen para organizar esta cita.",
    submit: "Confirmar reserva",
    sending: "Reservando…",
    back: "Elegir otra hora",
    successTitle: "Tu cita está reservada",
    successBody: "La hora está guardada. Descarga el archivo de calendario y revisa tu email.",
    download: "Añadir a mi calendario",
    again: "Reservar otra hora",
    error: "No se pudo reservar esa hora. Elige otra.",
    rate: "Demasiados intentos. Espera unos minutos y vuelve a probar.",
  },
  pt: {
    metaTitle: "Marca uma chamada · Oracle of Freedom",
    metaDescription: "Escolhe uma hora para conhecer a fotógrafa e videógrafa Agota Urbikaite.",
    eyebrow: "Um momento para nos conhecermos",
    title: "Marca tempo com a Agota",
    dek: "Escolhe o que precisas e uma hora livre. Os horários aparecem na hora de Lisboa.",
    chooseType: "1. Escolhe uma marcação",
    chooseTime: "2. Escolhe uma hora",
    yourDetails: "3. Os teus dados",
    duration: "minutos",
    loading: "A procurar horas livres…",
    unavailable: "Não há horas livres nas próximas semanas. Escreve-me e encontramos uma.",
    name: "O teu nome",
    email: "Email",
    note: "Há algo que a Agota deva saber?",
    notePlaceholder: "Conta-me um pouco sobre a tua ideia…",
    consent: "Aceito que os meus dados sejam usados para organizar esta marcação.",
    submit: "Confirmar marcação",
    sending: "A marcar…",
    back: "Escolher outra hora",
    successTitle: "A tua marcação está feita",
    successBody: "A hora está guardada. Descarrega o ficheiro de calendário e verifica o teu email.",
    download: "Adicionar ao meu calendário",
    again: "Marcar outra hora",
    error: "Não foi possível marcar essa hora. Escolhe outra.",
    rate: "Demasiadas tentativas. Espera alguns minutos e tenta novamente.",
  },
};
