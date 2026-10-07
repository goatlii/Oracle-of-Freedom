import type { Locale } from "@/i18n/routing";
import type { StaticPathname } from "@/i18n/routing";

export type JournalPost = {
  id: "boho" | "retreat" | "ericeira";
  date: string;
  service: StaticPathname;
  slugs: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  keywords: Record<Locale, string>;
  body: Record<Locale, string>;
};

export const posts: JournalPost[] = [
  {
    id: "boho",
    date: "2026-09-29",
    service: "/boho-elopements",
    slugs: {
      en: "boho-elopement-in-portugal",
      es: "elopement-boho-en-portugal",
      pt: "elopement-boho-em-portugal",
    },
    title: {
      en: "Boho elopement in Portugal: places, seasons & real costs",
      es: "Elopement boho en Portugal: lugares, temporadas y precios reales",
      pt: "Elopement boho em Portugal: locais, épocas e preços reais",
    },
    description: {
      en: "A 2027-minded guide to eloping in Portugal: coast, forest, season, symbolic ceremony and what a small day actually costs.",
      es: "Guía para fugaros a Portugal: costa, bosque, temporada, ceremonia simbólica y lo que cuesta un día pequeño.",
      pt: "Guia para um elopement em Portugal: costa, floresta, época, cerimónia simbólica e o que custa um dia pequeno.",
    },
    keywords: {
      en: "elope in Portugal; boho elopement Portugal",
      es: "elopement boho Portugal; fugarse en Portugal",
      pt: "elopement boho Portugal; casar em Portugal",
    },
    body: {
      en: `Portugal is kind to a small wedding. The light stays low and gold for a long hour, the coast is wild without being far, and a symbolic ceremony can happen on a cliff with the people you actually want in the circle.

## Places that hold a barefoot day

**Costa Vicentina.** Long cliffs, empty sand and wind. Best when you want the ocean to be the only guest besides your people. Mornings are calmer than late afternoons.

**Ericeira.** A fishing town with black rock, surf and a walkable wild edge. Easy to pair with a forest hour inland if you want two moods in one day.

**Sintra.** Moss, stone and forest weather that changes every hour. Beautiful for a handfasting under trees. Some gardens charge entry and close — ask before you plan the ceremony inside one.

**Alentejo.** Golden grass, cork oaks, long tables. The day feels slow, which suits a dinner under the stars more than a tight timeline.

**Western Algarve.** Cliffs that catch the last light, quieter than the south coast resorts if you stay west.

**Azores and Madeira.** Greener, wetter, more dramatic. Worth it when the landscape is the reason you are travelling, and when you can add a weather day.

## Season and light

May to October is the kind season for barefoot vows, and it books first — often 6 to 12 months ahead. April and late October can be glorious and empty. Winter is for people who like drama, rain plans and fewer crowds. I photograph the hour after sunrise or the hour before sunset. Midday on the coast is bright and flat.

## Symbolic, not a ballroom

Many couples marry legally at home and celebrate here. A friend, a celebrant or a shaman can hold the circle. I can suggest people who work this way. Handfasting, a cacao ceremony, flower crowns, drums and a small fire are all welcome. A fire needs a place that allows it, a sober spotter and a plan if the wind turns.

## What a simple day costs

A straightforward elopement — place, a few people, food, flowers from the field, and photography — often lands around €1,500–2,500 all in, before travel. Photography starts at €690 for 3–4 hours and €1,100 when the night, the fire and the dancing are part of it (a small wedding, up to about 30 guests). An elopement film starts at €650 and a small-wedding highlight at €875. These figures exclude VAT and are starting prices, confirmed in the quote. Travel from the Algarve to Lisbon, coast included, is part of the fee. Weddings further away — the rest of Portugal, Europe and beyond — are quoted at cost.

If you do not know the place yet, that is a good place to start. Tell me ocean, forest, plains or mountain and I will answer with somewhere real.`,
      es: `Portugal trata bien a una boda pequeña. La luz se queda baja y dorada durante una hora larga, la costa es salvaje sin quedar lejos, y una ceremonia simbólica puede ocurrir en un acantilado con la gente que de verdad quieres en el círculo.

## Lugares para un día descalzo

**Costa Vicentina.** Acantilados largos, arena vacía y viento. Cuando quieres que el océano sea el único invitado además de los vuestros. Las mañanas suelen estar más tranquilas.

**Ericeira.** Un pueblo de pesca con roca negra, surf y un borde salvaje que se recorre a pie. Se combina bien con una hora de bosque hacia el interior.

**Sintra.** Musgo, piedra y un tiempo de bosque que cambia cada hora. Precioso para un handfasting bajo los árboles. Algunos jardines cobran entrada y cierran: preguntad antes de planear la ceremonia dentro.

**Alentejo.** Hierba dorada, alcornoques, mesas largas. El día va lento, y eso le sienta bien a una cena bajo las estrellas.

**Algarve occidental.** Acantilados con la última luz, más quietos que los resorts del sur si os quedáis al oeste.

**Azores y Madeira.** Más verdes, más húmedas, más dramáticas. Merecen la pena cuando el paisaje es el motivo del viaje y podéis dejar un día de margen por el tiempo.

## Temporada y luz

De mayo a octubre es la temporada amable para votos descalzos, y se reserva antes: a menudo con 6–12 meses. Abril y finales de octubre pueden ser gloriosos y vacíos. El invierno es para quien quiere drama, plan de lluvia y menos gente. Fotografío la hora después del amanecer o la hora antes del atardecer.

## Simbólica, no un salón

Muchas parejas se casan legalmente en su país y lo celebran aquí. Un amigo, un oficiante o un chamán pueden sostener el círculo. Puedo recomendar a quien trabaja así. Handfasting, ceremonia de cacao, coronas de flores, tambores y un fuego pequeño caben. El fuego necesita un lugar que lo permita, una persona sobria de apoyo y un plan si gira el viento.

## Lo que cuesta un día sencillo

Un elopement sencillo — lugar, pocas personas, comida, flores del campo y fotografía — suele quedar alrededor de 1.500–2.500 € en total, sin viajes. La fotografía empieza en 690 € por 3–4 horas y en 1.100 € cuando la noche, el fuego y el baile forman parte (una boda íntima, hasta unas 30 personas). Una película de elopement empieza en 650 € y un highlight de boda íntima en 875 €. Estas cifras no incluyen IVA y son precios de partida, que se confirman en el presupuesto. El desplazamiento del Algarve a Lisboa, costa incluida, forma parte del precio. Las bodas más lejos — el resto de Portugal, Europa y más allá — se presupuestan a coste real.

Si aún no sabéis el lugar, ese es un buen comienzo. Decidme océano, bosque, llanura o montaña y os respondo con un sitio real.`,
      pt: `Portugal trata bem um casamento pequeno. A luz fica baixa e dourada durante uma hora longa, a costa é selvagem sem ficar longe, e uma cerimónia simbólica pode acontecer numa falésia com as pessoas que realmente queres no círculo.

## Locais para um dia descalço

**Costa Vicentina.** Falésias longas, areia vazia e vento. Para quando queres que o oceano seja o único convidado além dos vossos. As manhãs costumam ser mais calmas.

**Ericeira.** Uma vila de pesca com rocha negra, surf e uma orla selvagem que se percorre a pé. Combina bem com uma hora de floresta mais para o interior.

**Sintra.** Musgo, pedra e um tempo de floresta que muda a cada hora. Lindo para um handfasting debaixo das árvores. Alguns jardins cobram entrada e fecham: perguntem antes de marcar a cerimónia lá dentro.

**Alentejo.** Erva dourada, sobreiros, mesas compridas. O dia é lento, e isso assenta bem a um jantar sob as estrelas.

**Algarve ocidental.** Falésias com a última luz, mais quietas do que os resorts do sul se ficarem a oeste.

**Açores e Madeira.** Mais verdes, mais húmidos, mais dramáticos. Valem a pena quando a paisagem é a razão da viagem e podem deixar um dia de margem por causa do tempo.

## Época e luz

De maio a outubro é a época amável para votos descalços, e enche primeiro — muitas vezes com 6 a 12 meses de antecedência. Abril e o fim de outubro podem ser gloriosos e vazios. O inverno é para quem gosta de drama, de um plano para a chuva e de menos gente. Fotografo a hora a seguir ao nascer do sol ou a hora antes do pôr do sol.

## Simbólica, não um salão

Muitos casais casam legalmente no seu país e celebram aqui. Um amigo, um celebrante ou um xamã podem segurar o círculo. Posso sugerir quem trabalha assim. Handfasting, cerimónia de cacau, coroas de flores, tambores e uma fogueira pequena cabem. O fogo precisa de um sítio que o permita, de uma pessoa sóbria de apoio e de um plano se o vento virar.

## O que custa um dia simples

Um elopement simples — local, poucas pessoas, comida, flores do campo e fotografia — costuma ficar à volta de 1.500–2.500 € no total, sem deslocações. A fotografia começa em 690 € por 3–4 horas e em 1.100 € quando a noite, o fogo e a dança fazem parte (um casamento íntimo, até cerca de 30 pessoas). Um filme de elopement começa em 650 € e um highlight de casamento íntimo em 875 €. Estes valores não incluem IVA e são preços de partida, confirmados no orçamento. A deslocação do Algarve a Lisboa, costa incluída, faz parte do preço. Casamentos mais longe — o resto de Portugal, a Europa e mais além — orçamentam-se ao custo real.

Se ainda não sabem o local, é um bom começo. Digam-me oceano, floresta, planície ou montanha e eu respondo com um sítio real.`,
    },
  },
  {
    id: "retreat",
    date: "2026-09-29",
    service: "/retreats-gatherings",
    slugs: {
      en: "photograph-your-retreat",
      es: "fotografiar-tu-retiro",
      pt: "fotografar-o-teu-retiro",
    },
    title: {
      en: "How to photograph your retreat so it sells out next time",
      es: "Cómo fotografiar tu retiro para llenar el próximo",
      pt: "Como fotografar o teu retiro para encher o próximo",
    },
    description: {
      en: "A checklist for retreat leaders: the shots future guests need, consent in sacred spaces, and five reels that carry the feeling.",
      es: "Una lista para quien organiza retiros: las tomas que el próximo grupo necesita ver, el consentimiento y cinco reels.",
      pt: "Uma lista para quem organiza retiros: os planos que o próximo grupo precisa de ver, o consentimento e cinco reels.",
    },
    keywords: {
      en: "retreat photographer Portugal; retreat photography tips",
      es: "fotografía de retiros; fotógrafa de retiros",
      pt: "fotografia de retiros; fotógrafa de retiros",
    },
    body: {
      en: `People book a retreat on a feeling. The circle, the quiet, the soup, the walk back from the sea. If last year's photographs were only the yoga pose and the bedroom, the next launch has to work much harder.

## A shot list that fills dates

**The space.** Arrival, the bed, the window, the mat, the cold-water bucket, the path. Horizontal frames help listings. Check the current image rules on BookRetreats, Retreat Guru, your own site and Airbnb-style pages before the shoot — they change, and they usually want real rooms, not only atmosphere.

**The practice.** Wide enough to feel the group, close enough to feel one face. Hands, feet, the teacher from the side, never a stiff lineup unless that is truly how you teach.

**The food.** Hands serving, the table before anyone sits, steam, bread, the garden it came from.

**The people.** Facilitators as you want them on the team page. Guests only with a yes. Laughter between sessions is often the photograph that sells the next date.

**The landscape.** Where the place sits in the land: morning light, the walk, the weather. This is what makes someone feel they could be there.

## Consent in a sacred room

I join the opening circle and say who I am. We name the no-camera moments before they happen — ceremonies, breathwork peaks, integration shares. A wristband or a simple signal is enough for anyone who wants to stay out of the frame. Nothing goes public until you have seen the selection.

## Five reels

1. A slow walk from the gate to the first view, no voiceover.
2. Hands preparing food, cut to the table.
3. One true laugh, not a posed group hug.
4. The practice from the back of the room, so faces stay optional.
5. The last morning: bags, hugs, the empty circle.

A retreat day starts at €400 and is edited on site. A three-day retreat starts at €1,000 and includes five vertical reels plus facilitator portraits, with a commercial licence for your own marketing. Prices exclude VAT and are starting points, confirmed in the quote.`,
      es: `La gente reserva un retiro por lo que siente. El círculo, el silencio, la sopa, el camino de vuelta del mar. Si las fotos del año pasado eran solo la postura de yoga y la habitación, el próximo lanzamiento tiene que esforzarse mucho más.

## Una lista de tomas que llena fechas

**El espacio.** La llegada, la cama, la ventana, la esterilla, el camino. Los encuadres horizontales ayudan en los anuncios. Revisa las normas actuales de imagen en BookRetreats, Retreat Guru, tu web y páginas tipo Airbnb antes de la sesión: cambian, y suelen pedir habitaciones reales, no solo atmósfera.

**La práctica.** Lo bastante amplia para sentir al grupo, lo bastante cerca para sentir una cara. Manos, pies, quien facilita de lado. Nada de fila rígida si no es así como enseñas.

**La comida.** Manos sirviendo, la mesa antes de que nadie se siente, el vapor, el huerto del que salió.

**Las personas.** Facilitadores como quieres verlos en la página del equipo. Participantes solo con un sí. La risa entre sesiones suele ser la foto que vende la siguiente fecha.

**El paisaje.** Dónde se sienta el lugar en la tierra: la luz de la mañana, el paseo, el tiempo. Eso es lo que hace que alguien sienta que podría estar allí.

## Consentimiento en una sala sagrada

Me presento en el círculo de apertura. Nombramos los momentos sin cámara antes de que ocurran: ceremonias, picos de breathwork, círculos de integración. Una pulsera o una señal basta para quien no quiere salir. Nada se publica hasta que hayas visto la selección.

## Cinco reels

1. Un paseo lento desde la puerta hasta la primera vista, sin voz en off.
2. Manos preparando comida, y luego la mesa.
3. Una risa de verdad, no un abrazo de grupo posado.
4. La práctica desde el fondo de la sala, para que las caras sigan siendo opcionales.
5. La última mañana: bolsas, abrazos, el círculo vacío.

Un día de retiro empieza en 400 € y se edita en el lugar. Un retiro de tres días empieza en 1.000 € e incluye cinco reels verticales y retratos de facilitadores, con licencia comercial para tu propio marketing. Los precios no incluyen IVA y son de partida, confirmados en el presupuesto.`,
      pt: `As pessoas reservam um retiro pelo que sentem. O círculo, o silêncio, a sopa, o caminho de volta do mar. Se as fotografias do ano passado eram só a postura de yoga e o quarto, o próximo lançamento tem de trabalhar muito mais.

## Uma lista de planos que enche datas

**O espaço.** A chegada, a cama, a janela, o tapete, o caminho. Os enquadramentos horizontais ajudam nos anúncios. Confirma as regras atuais de imagem no BookRetreats, no Retreat Guru, no teu site e em páginas ao estilo Airbnb antes da sessão: mudam, e normalmente pedem quartos reais, não só atmosfera.

**A prática.** Larga o suficiente para se sentir o grupo, próxima o suficiente para se sentir uma cara. Mãos, pés, quem facilita de lado. Nada de fila rígida se não é assim que ensinas.

**A comida.** Mãos a servir, a mesa antes de alguém se sentar, o vapor, a horta de onde veio.

**As pessoas.** Facilitadores como os queres na página da equipa. Participantes só com um sim. O riso entre sessões é muitas vezes a fotografia que vende a data seguinte.

**A paisagem.** Onde o espaço se senta na terra: a luz da manhã, o passeio, o tempo. É isso que faz alguém sentir que podia estar ali.

## Consentimento numa sala sagrada

Apresento-me no círculo de abertura. Nomeamos os momentos sem câmara antes de acontecerem: cerimónias, picos de breathwork, partilhas de integração. Uma pulseira ou um sinal chega para quem quer ficar de fora. Nada é publicado até teres visto a seleção.

## Cinco reels

1. Um passeio lento do portão até à primeira vista, sem voz off.
2. Mãos a preparar comida, e depois a mesa.
3. Uma gargalhada verdadeira, não um abraço de grupo posado.
4. A prática a partir do fundo da sala, para as caras continuarem opcionais.
5. A última manhã: malas, abraços, o círculo vazio.

Um dia de retiro começa em 400 € e é editado no local. Um retiro de três dias começa em 1.000 € e inclui cinco reels verticais e retratos dos facilitadores, com licença comercial para o teu próprio marketing. Os preços não incluem IVA e são de partida, confirmados no orçamento.`,
    },
  },
  {
    id: "ericeira",
    date: "2026-09-29",
    service: "/portraits-engagement",
    slugs: {
      en: "couple-photoshoot-ericeira-sintra",
      es: "sesion-pareja-ericeira-sintra",
      pt: "sessao-casal-ericeira-sintra",
    },
    title: {
      en: "Magical spots for a couple photoshoot around Ericeira & Sintra",
      es: "Los lugares más mágicos para una sesión de pareja en Ericeira y Sintra",
      pt: "Os sítios mais mágicos para uma sessão de casal na Ericeira e em Sintra",
    },
    description: {
      en: "A golden-hour guide to the Ericeira coast and Sintra forests: when to go, what to wear, and how to arrive without rushing.",
      es: "Guía de hora dorada por la costa de Ericeira y los bosques de Sintra: cuándo ir, qué poneros y cómo llegar sin prisa.",
      pt: "Guia da hora dourada pela costa da Ericeira e pelas florestas de Sintra: quando ir, o que vestir e como chegar sem pressa.",
    },
    keywords: {
      en: "Ericeira photoshoot; Sintra couple photoshoot",
      es: "sesión de fotos Ericeira; sesión de pareja Sintra",
      pt: "sessão fotográfica Ericeira; sessão de casal Sintra",
    },
    body: {
      en: `Ericeira and Sintra sit close enough for one golden hour on the rocks and another under the trees. This list follows the public coast and the forest edge. Private land and ticketed gardens need a yes before we walk in. Travel is included from the Algarve up to Lisbon. Ericeira and Sintra sit just north of that, so say if you are staying there and the plan can include the short hop.

## Ericeira

**Ribeira d'Ilhas and the cliff path.** Surf, long grass, a wide sky. Come for the hour before sunset and park with time to walk, not to pose in a car park.

**The south-facing coves below town.** Smaller, rockier, good when you want to be close to each other rather than in a landscape. Check the tide. Wet rock is not romantic if someone slips.

**São Lourenço.** A long beach north of town. Morning light is softer. Wind is part of the picture — linen and anything that moves will help.

## Sintra

**The forest roads around the hills, not only the palaces.** Moss, cork and sudden fog. Late afternoon in spring and autumn. Palaces and walled gardens have tickets and closing times; we plan around public paths unless you have arranged entry.

**Cabo da Roca.** The windiest viewpoint, powerful and brief. Ten minutes of cliffs, then somewhere calmer, or the hair wins.

**Praia da Ursa and Adraga.** Dramatic sand under the cape. The path down to Ursa is steep. Only go if you are steady on your feet and the track is open; there is no photograph worth a fall. Adraga is an easier walk from the car park and still feels wild.

**Azenhas do Mar.** White houses above a cove. Pretty in the last light, busier in summer. Arrive early in the golden hour.

## What to wear

Sand, clay, moss, cream, a little terracotta. Nothing with a big logo. Bare feet if the ground allows. I send a short style note after you book. One outfit is enough for a shorter session; a longer one can hold a second look if the two places ask for it.

## How to arrive

Lisbon is under an hour from Ericeira in easy traffic, longer on a Friday. Sintra needs patience and a car, or a taxi that can wait. We pick the clock for the light, not for convenience, and we leave a gap in case the fog sits down.

Portrait sessions start at €175, for one person, a couple, a family or friends. The final price depends on the length, the photographs, the places and how many people. A short film starts at €250, or €475 for the portrait session and the film together. Tell me the week you are here and whether you want ocean, forest, or both.`,
      es: `Ericeira y Sintra están lo bastante cerca para una hora dorada en las rocas y otra bajo los árboles. Esta lista sigue la costa pública y el borde del bosque. El terreno privado y los jardines con entrada necesitan un sí antes de entrar. El desplazamiento está incluido del Algarve a Lisboa. Ericeira y Sintra quedan justo al norte: si os alojáis ahí, decidlo y el plan puede incluir ese salto corto.

## Ericeira

**Ribeira d'Ilhas y el camino del acantilado.** Surf, hierba larga, un cielo ancho. Venid la hora antes del atardecer y aparcad con tiempo para caminar, no para posar en un parking.

**Las calas al sur del pueblo.** Más pequeñas, más roca, buenas cuando queréis estar cerca el uno del otro. Mirad la marea. La roca mojada no es romántica si alguien resbala.

**São Lourenço.** Una playa larga al norte. La luz de la mañana es más suave. El viento forma parte de la foto: el lino y lo que se mueve ayudan.

## Sintra

**Los caminos de bosque alrededor de las colinas, no solo los palacios.** Musgo, corcho y niebla repentina. Última hora de la tarde en primavera y otoño. Los palacios y los jardines vallados tienen entrada y horario; planificamos por senderos públicos salvo que hayáis reservado el acceso.

**Cabo da Roca.** El mirador más ventoso, potente y breve. Diez minutos de acantilado y luego un sitio más tranquilo, o gana el pelo.

**Praia da Ursa y Adraga.** Arena dramática bajo el cabo. La bajada a Ursa es empinada. Id solo si vais firmes y el camino está abierto; no hay foto que merezca una caída. Adraga se anda mejor desde el aparcamiento y sigue siendo salvaje.

**Azenhas do Mar.** Casas blancas sobre una cala. Bonito con la última luz, más lleno en verano. Llegad pronto en la hora dorada.

## Qué poneros

Arena, arcilla, musgo, crema, un poco de terracota. Nada con un logo grande. Pies descalzos si el suelo lo permite. Tras reservar os envío una nota breve de estilo. Un look basta para una sesión corta; una más larga puede con un segundo si los dos lugares lo piden.

## Cómo llegar

Lisboa queda a menos de una hora de Ericeira con poco tráfico, más un viernes. Sintra pide paciencia y un coche, o un taxi que pueda esperar. Elegimos la hora por la luz, no por la comodidad, y dejamos un margen por si se sienta la niebla.

Las sesiones de retrato empiezan en 175 €, para una persona, una pareja, una familia o amigos. El precio final depende de la duración, las fotografías, los lugares y cuántas personas sois. Una película corta empieza en 250 €, o en 475 € con la sesión de retrato y el vídeo juntos. Contadme la semana en la que estáis y si queréis océano, bosque o los dos.`,
      pt: `A Ericeira e Sintra ficam perto o suficiente para uma hora dourada nas rochas e outra debaixo das árvores. Esta lista segue a costa pública e a orla da floresta. Terreno privado e jardins com bilhete precisam de um sim antes de entrarmos. A deslocação está incluída do Algarve a Lisboa. A Ericeira e Sintra ficam mesmo a norte: se ficarem aí, digam e o plano pode incluir esse salto curto.

## Ericeira

**Ribeira d'Ilhas e o caminho da falésia.** Surf, erva alta, um céu largo. Venham na hora antes do pôr do sol e estacionem com tempo para caminhar, não para posar num parque.

**As enseadas a sul da vila.** Mais pequenas, mais rocha, boas quando querem estar perto um do outro. Vejam a maré. Rocha molhada não é romântica se alguém escorrega.

**São Lourenço.** Uma praia comprida a norte. A luz da manhã é mais suave. O vento faz parte da fotografia — linho e tudo o que se mexe ajuda.

## Sintra

**Os caminhos de floresta à volta das colinas, não só os palácios.** Musgo, cortiça e nevoeiro súbito. Fim de tarde na primavera e no outono. Palácios e jardins murados têm bilhete e horário; planeamos por trilhos públicos, salvo se tiverem combinado a entrada.

**Cabo da Roca.** O miradouro mais ventoso, forte e breve. Dez minutos de falésia e depois um sítio mais calmo, ou o cabelo ganha.

**Praia da Ursa e Adraga.** Areia dramática sob o cabo. A descida para a Ursa é íngreme. Vão só se estiverem firmes e o trilho estiver aberto; não há fotografia que valha uma queda. A Adraga anda-se melhor a partir do parque e continua selvagem.

**Azenhas do Mar.** Casas brancas sobre uma enseada. Bonito na última luz, mais cheio no verão. Cheguem cedo na hora dourada.

## O que vestir

Areia, barro, musgo, creme, um pouco de terracota. Nada com um logótipo grande. Pés descalços se o chão deixar. Depois da marcação envio uma nota curta de estilo. Um look chega para uma sessão curta; uma mais longa pode levar um segundo se os dois locais o pedirem.

## Como chegar

Lisboa fica a menos de uma hora da Ericeira com pouco trânsito, mais numa sexta. Sintra pede paciência e um carro, ou um táxi que possa esperar. Escolhemos a hora pela luz, não pela conveniência, e deixamos uma margem caso o nevoeiro se sente.

As sessões de retrato começam em 175 €, para uma pessoa, um casal, uma família ou amigos. O preço final depende da duração, das fotografias, dos sítios e de quantas pessoas são. Um filme curto começa em 250 €, ou em 475 € com a sessão de retrato e o filme juntos. Digam-me a semana em que estão e se querem oceano, floresta ou os dois.`,
    },
  },
];

export function postBySlug(locale: Locale, slug: string) {
  return posts.find((post) => post.slugs[locale] === slug);
}

export function postById(id: JournalPost["id"]) {
  const post = posts.find((item) => item.id === id);
  if (!post) throw new Error(`Missing journal post ${id}`);
  return post;
}
