export type Media = { id: string; title: string; alt: string; tag: 'After dark' | 'Daylight' | 'Details'; width: number; height: number };
export const media: Media[] = [
  {id:'P17',title:'Blue hour, blue Mustang',alt:'Blue Ford Mustang photographed in the evening light',tag:'Daylight',width:1080,height:864},
  {id:'P18',title:'A different perspective',alt:'Grey Toyota Supra parked beneath the trees',tag:'Daylight',width:1080,height:1080},
  {id:'P19',title:'Built for the everyday',alt:'White SUV photographed in warm evening light',tag:'Daylight',width:1600,height:1280},
  {id:'P20',title:'Quiet confidence',alt:'White BMW sedan parked at a gathering',tag:'Daylight',width:1080,height:720},
  {id:'P22',title:'In good company',alt:'Dark Ford Mustang at an outdoor gathering',tag:'Daylight',width:1080,height:864},
  {id:'P13',title:'An enduring silhouette',alt:'Black classic sports car at a night gathering',tag:'After dark',width:3024,height:4032},
  {id:'P01',title:'Doors up. Lights on.',alt:'Green Mustang with raised doors and green lighting at night',tag:'After dark',width:3024,height:4032},
  {id:'P04',title:'Conversations, car-side',alt:'People talking beside a turquoise sports car at night',tag:'After dark',width:3024,height:4032},
  {id:'P08',title:'The evening line-up',alt:'Silver, red and blue sports cars lined up at a night meet',tag:'After dark',width:4032,height:3024},
  {id:'P09',title:'Small car. Big character.',alt:'Front of a red classic Mini at a night gathering',tag:'After dark',width:3024,height:4032},
  {id:'P12',title:'Made to stand out',alt:'White sports coupe with a red and black illustrated wrap',tag:'Details',width:4032,height:3024},
  {id:'P15',title:'Every curve counts',alt:'Close view of orange McLaren bodywork and rear lighting',tag:'Details',width:4032,height:3024},
  {id:'P16',title:'The view from behind',alt:'Rear view of an orange McLaren at a night meet',tag:'After dark',width:4032,height:3024},
  {id:'P07',title:'The little details',alt:'Close view of a black Mustang’s red tail lights',tag:'Details',width:3024,height:4032},
];
export const photo = (id: string) => media.find(m => m.id === id)!;
