import { Link } from 'react-router-dom';
import type { SupportedLang } from '../i18n/config';

const copy = {
  en: {
    title: 'China to Canada LCL shipping: calculate CBM before requesting a quote',
    intro: 'Prepare the same shipment details for every forwarder so you can compare written quotes for the same Canadian destination.',
    steps: [
      ['Measure the packed shipment', 'Record each box’s outer length, width and height in centimetres, box count and gross weight. Include pallets and protective packaging in the measurements you send.'],
      ['Calculate total cubic metres (CBM)', 'Length × width × height ÷ 1,000,000 gives cubic metres for one box. Add the volume of every box; multiply by quantity only when the boxes have identical dimensions.'],
      ['Confirm the billable quantity', 'Measured volume is not necessarily the charged quantity. Ask for the weight-to-volume rule, minimum charge and rounding. DHL’s guide distinguishes LCL volume/weight billing from FCL container billing; confirm your chosen service’s terms.'],
      ['Request an itemised destination total', 'Provide the origin and Canadian city/postal code. Ask which pickup, origin handling, ocean freight, destination handling, clearance, tax and delivery charges apply and which are included. Record currency, quote date and expiry. Ask whether the time estimate is port-to-port or door-to-door.'],
    ],
    example: 'Volume example, not a freight quote: three boxes, each 60 × 40 × 50 cm, occupy 0.12 m³ each and 0.36 m³ in total. This does not establish a price or a billable minimum.',
    reference: 'Reference: DHL chargeable weight guide',
    faq: 'Read the freight cost and chargeable weight FAQ',
  },
  zh: {
    title: '中国到加拿大海运拼箱：询价前先算清立方数',
    intro: '向各货代提供同一批货物资料和同一个加拿大目的地，再比较书面报价。',
    steps: [
      ['测量包装后的货物', '记录每箱外部的长、宽、高（厘米）、箱数及毛重。提交的尺寸和重量应包含托盘及保护包装。'],
      ['计算总体积（CBM）', '单箱长 × 宽 × 高 ÷ 1,000,000 = 立方米。各箱体积相加；只有尺寸相同的箱子才直接乘以箱数。'],
      ['确认实际计费量', '测得的体积不一定等于计费量。请确认重量与体积的换算规则、最低收费和进位规则。DHL 指南区分拼箱的体积/重量计费与整柜计费；具体以所选服务条款为准。'],
      ['索取分项到门总价', '提供起运地、加拿大城市和邮编，逐项确认提货、起运港操作、海运、目的港操作、清关、税费及派送是否适用和包含。记录币种、报价日期及有效期，并问清时效是港到港还是门到门。'],
    ],
    example: '体积示例，不是运费报价：3箱货物，每箱60 × 40 × 50厘米，单箱0.12立方米，合计0.36立方米。这不能直接确定运费或最低计费量。',
    reference: '参考：DHL计费重量指南',
    faq: '阅读运费及计费重常见问题',
  },
  fr: {
    title: 'Groupage maritime Chine–Canada : calculer les mètres cubes avant le devis',
    intro: 'Présentez les mêmes marchandises et la même destination canadienne à chaque transitaire pour comparer des devis écrits.',
    steps: [
      ['Mesurer les colis emballés', 'Notez les dimensions extérieures en centimètres, le nombre de colis et le poids brut. Incluez palettes et protections dans les mesures transmises.'],
      ['Calculer le volume total (CBM)', 'Longueur × largeur × hauteur ÷ 1 000 000 donne le volume d’un colis en mètres cubes. Additionnez les volumes ; multipliez par la quantité uniquement pour des colis de dimensions identiques.'],
      ['Confirmer la quantité facturable', 'Le volume mesuré peut différer de la quantité facturée. Demandez la règle poids/volume, le minimum et l’arrondi. Le guide DHL distingue la facturation LCL au volume/poids de celle du FCL par conteneur. Vérifiez les conditions du service choisi.'],
      ['Demander un total détaillé à destination', 'Indiquez le lieu de départ, la ville canadienne et le code postal. Faites préciser les frais applicables et inclus : enlèvement, manutention au départ et à destination, fret, dédouanement, taxes et livraison. Notez devise, date et validité du devis. Le délai est-il de port à port ou de porte à porte ?'],
    ],
    example: 'Exemple de volume, pas un devis : trois cartons de 60 × 40 × 50 cm représentent chacun 0,12 m³, soit 0,36 m³ au total. Cela ne détermine ni le prix ni le minimum facturable.',
    reference: 'Source : guide DHL du poids facturable',
    faq: 'Consulter les questions sur les coûts et le poids facturable',
  },
  es: {
    title: 'Envíos marítimos LCL de China a Canadá: calcule los metros cúbicos antes de cotizar',
    intro: 'Envíe los mismos datos de carga y destino canadiense a cada transitario para comparar presupuestos escritos.',
    steps: [
      ['Mida la carga embalada', 'Anote largo, ancho y alto exteriores en centímetros, número de bultos y peso bruto. Incluya palés y embalaje protector en las medidas enviadas.'],
      ['Calcule el volumen total (CBM)', 'Largo × ancho × alto ÷ 1.000.000 da los metros cúbicos de una caja. Sume todos los volúmenes; multiplique por la cantidad solo si las dimensiones son idénticas.'],
      ['Confirme la cantidad facturable', 'El volumen medido puede diferir de la cantidad cobrada. Pregunte por la regla de peso/volumen, el mínimo y el redondeo. DHL distingue la facturación LCL por volumen/peso de la facturación FCL por contenedor. Confirme las condiciones del servicio elegido.'],
      ['Solicite un total desglosado hasta destino', 'Indique origen, ciudad canadiense y código postal. Confirme qué gastos se aplican y se incluyen: recogida, manipulación en origen y destino, flete, despacho, impuestos y entrega. Anote moneda, fecha y validez del presupuesto. Pregunte si el plazo es de puerto a puerto o de puerta a puerta.'],
    ],
    example: 'Ejemplo de volumen, no un presupuesto: tres cajas de 60 × 40 × 50 cm ocupan 0,12 m³ cada una y 0,36 m³ en total. Esto no determina el precio ni el mínimo facturable.',
    reference: 'Fuente: guía DHL del peso facturable',
    faq: 'Consultar las preguntas sobre costes y peso facturable',
  },
} satisfies Record<SupportedLang, { title: string; intro: string; steps: string[][]; example: string; reference: string; faq: string }>;

export default function SeaQuoteGuide({ lang }: { lang: SupportedLang }) {
  const text = copy[lang];
  return (
    <section aria-labelledby="sea-quote-guide" style={{ marginTop: 32, lineHeight: 1.8, overflowWrap: 'anywhere' }}>
      <h2 id="sea-quote-guide">{text.title}</h2>
      <p>{text.intro}</p>
      <ol style={{ paddingInlineStart: 24 }}>
        {text.steps.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}
      </ol>
      <p><strong>{text.example}</strong></p>
      <p><a href="https://www.dhl.com/us-en/home/global-forwarding/freight-forwarding-education-center/calculating-chargeable-weights.html" target="_blank" rel="noopener noreferrer">{text.reference}</a></p>
      <p><Link to={`/${lang}/faq`}>{text.faq}</Link></p>
    </section>
  );
}
