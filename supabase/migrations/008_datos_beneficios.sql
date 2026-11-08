-- Reparte las descripciones largas en: eslogan + descripción, y beneficios/características.
-- Ejecutar DESPUÉS de 007_beneficios.sql, en el SQL Editor de Supabase (una sola vez).
-- Revisa el resultado en /admin y ajusta lo que haga falta.

-- jabon: Jabón Artesanal Circular – Aroma Coco
update products set description = $d$"Suavidad tropical y nutrición profunda en un formato clásico que se adapta a tus manos."
Disfruta de una limpieza cremosa y envolvente con nuestro Jabón Circular de Coco. Su forma ergonómica resulta súper cómoda para el uso diario, dejando la piel hidratada, tersa y con un irresistible aroma dulce y tropical que perdura.$d$, benefits = $d$Forma: Circular.
Aroma: Coco dulce y tropical.
Uso: Manos y cuerpo.
Tip de cuidado: Para prolongar su duración, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = '73ee8976-f663-4a5b-aa66-420d4cccce39';

-- jabon: Jabón Artesanal Perrito – Aroma Rosa
update products set description = $d$"La simpatía de un diseño único combinada con la delicadeza floral de las rosas."
Convierte el lavado diario en un detalle especial con nuestro Jabón Perrito de Rosa. Su formato tierno y artesanal aporta encanto a cualquier espacio y es perfecto para regalar, cuidando tu piel mientras libera una fragancia floral fresca, suave y elegante.$d$, benefits = $d$Forma: Perrito.
Aroma: Rosa floral delicada.
Uso: Manos y cuerpo.
Tip de cuidado: Para que conserve su forma y dure mucho más tiempo, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = '7b9a2f16-06c9-470d-957c-b0266faafe94';

-- jabon: Jabón Artesanal Perrito – Aroma Vainilla
update products set description = $d$"Ternura adorable con el abrazo dulce y cálido de la vainilla en cada lavado."
Dale un toque dulce y acogedor a tu baño con nuestro Jabón Perrito de Vainilla. Su diseño artesanal es ideal para enamorar a los amantes de las mascotas o para hacer un regalo original, dejando tu piel limpia, suave y con un perfume cálido irresistible.$d$, benefits = $d$Forma: Perrito.
Aroma: Vainilla dulce y cálida.
Uso: Manos y cuerpo.
Tip de cuidado: Para que conserve su forma y dure mucho más tiempo, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = 'd3850a3d-3136-46b0-8cb6-1feacebbbeee';

-- jabon: Jabón Artesanal Rectangular – Aroma Lavanda
update products set description = $d$"Calma pura y limpieza suave en una barra clásica ideal para tu rutina de descanso."
Transforma tu baño diario en un momento de relajación con nuestro Jabón Rectangular de Lavanda. Su formato tradicional en barra ofrece un agarre firme y un rendimiento excelente, dejando tu piel limpia, tersa y envuelta en un aroma floral calmante.$d$, benefits = $d$Forma: Rectangular.
Aroma: Lavanda relajante.
Uso: Manos y cuerpo.
Tip de cuidado: Para prolongar su duración, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = '0e549818-89ed-4d0c-977a-b49809e6bc83';

-- jabon: Jabón Circular Iluminador de Arroz y Avena
update products set description = $d$"Luminosidad natural y tono uniforme en cada lavado: el secreto del arroz y la avena para una piel radiante."
Renueva la luz natural de tu piel con nuestro Jabón Circular de Arroz, Avena y Coco. Su formato redondo es ideal para masajear suavemente el rostro o el cuerpo, ayudando a unificar el tono, suavizar la textura y aportar una hidratación profunda sin resecar.$d$, benefits = $d$Forma: Circular.
Beneficio principal: Iluminador, suavizante y unificador del tono.
Uso: Rostro y cuerpo.
Tip de cuidado: Para prolongar su duración, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = '8af945d2-cc42-4be9-8f49-d2128828eda7';

-- jabon: Jabón Relajante Gatito de Lavanda
update products set description = $d$"Un detalle adorable que limpia, suaviza y relaja tus sentidos."
Convierte tu rutina diaria en un momento de descanso con nuestro Jabón Gatito de Lavanda. Su diseño tierno y artesanal lo hace ideal tanto para darle un toque especial a tu baño como para hacer un regalo original, dejando la piel limpia, suave y delicadamente perfumada.$d$, benefits = $d$Forma: Gatito.
Aroma: Lavanda relajante.
Uso: Manos y cuerpo.
Tip de cuidado: Para que conserve su forma y dure mucho más tiempo, déjalo secar en una jabonera con buen drenaje después de cada uso.$d$ where id = 'd2e35a27-7576-412f-8cb6-86d8004c1a7f';

-- vela: Brisa de Limón – Edición Rectangular
update products set description = $d$"Un toque de frescura cítrica y diseño minimalista para iluminar tus espacios."
Nuestra Vela Rectangular de Limón está diseñada para aportar un estilo moderno y limpio a cualquier ambiente, mientras libera una fragancia cítrica refrescante que neutraliza olores y revitaliza el espacio.$d$, benefits = $d$Diseño versátil: Su formato rectangular en bloque es ideal para centros de mesa, bandejas decorativas o escritorios.
Aroma revitalizante: El limón aporta sensación de limpieza, concentración y energía positiva.
Combustión pareja y de producción artesanal$d$ where id = '6344c401-a304-42e8-a562-e0eaceaf76c3';

-- vela: Perrito Dulce Manzana
update products set description = $d$"El detalle más dulce y original para regalar o decorar tu rincón favorito."
Dale un toque de calidez y originalidad a tus espacios con nuestra Vela Perrito de Manzana. Su diseño artesanal la convierte en el adorno perfecto o en un regalo inolvidable, mientras perfuma el ambiente con una fragancia frutal dulce y acogedora.$d$, benefits = $d$Forma: Perrito decorativo.
Aroma: Manzana dulce / fresca.
Tip de uso: Colócala sobre un platito o bandeja resistente al calor antes de encenderla para proteger tus muebles.$d$ where id = '9380a5a2-bae6-4846-9ea8-495fce961e49';

-- vela: Vela Aromática Gatito – Aroma Incienso
update products set description = $d$"Calma, misticismo y ternura en una sola pieza: el aroma envolvente del incienso para tus momentos de paz."
Crea un ambiente relajante y lleno de armonía con nuestra Vela Gatito de Incienso. Su diseño artesanal aporta un toque cálido y original a cualquier rincón, mientras su fragancia profunda ayuda a desconectar y equilibrar la energía de tu hogar.$d$, benefits = $d$Forma: Gatito decorativo.
Aroma: Incienso cálido y relajante.
Tip de uso: Al ser una vela de forma, colócala siempre sobre un platito o bandeja resistente al calor antes de encenderla.$d$ where id = '766ed72f-0e4a-437f-9aa7-9b0e63c13169';

-- vela: Vela Decorativa Gatito Cítrico
update products set description = $d$"Ilumina tu rincón favorito con la simpatía de este gatito y la pureza del limón fresco."
Dale vida y frescura a tu hogar con nuestra Vela Gatito de Limón. Su diseño artesanal la hace ideal tanto para decorar un escritorio o repisa como para hacer un regalo original, liberando una fragancia cítrica limpia y revitalizante.$d$, benefits = $d$Forma: Gatito decorativo.
Aroma: Limón fresco.
Tip de uso: Al ser una vela de forma, colócala siempre sobre un platito o bandeja resistente al calor antes de encenderla.$d$ where id = '40f7cff1-f61d-496a-9161-b83ca7725098';

-- vela: Vela Gatito – Aroma Manzana
update products set description = $d$"El detalle más dulce para tu hogar: ternura decorativa con el aroma acogedor de la manzana."
Dale un toque de calidez y dulzura a tu rincón favorito con nuestra Vela Gatito de Manzana. Su diseño artesanal la convierte en el adorno perfecto o en un obsequio inolvidable, perfumando el espacio con una fragancia frutal suave y envolvente.$d$, benefits = $d$Forma: Gatito decorativo.
Aroma: Manzana dulce.
Tip de uso: Al ser una vela de forma, colócala siempre sobre un platito o bandeja resistente al calor antes de encenderla.$d$ where id = '3d95d327-5bfc-4c0b-8dc9-963955c7c381';

-- vela: Vela Gatito – Aroma Menta
update products set description = $d$"Frescura pura y diseño adorable para renovar el aire y despejar la mente."
Llena tus espacios de vitalidad con nuestra Vela Gatito de Menta. Ideal para escritorios, salas de estudio o para hacer un regalo diferente, combina una figura encantadora con un aroma herbal fresco que revitaliza el ambiente al instante.$d$, benefits = $d$Forma: Gatito decorativo.
Aroma: Menta fresca y herbal.
Tip de uso: Al ser una vela de forma, colócala siempre sobre un platito o bandeja resistente al calor antes de encenderla.$d$ where id = '2fe6bfe9-ce86-4621-a19d-cc9c5b1cafda';

