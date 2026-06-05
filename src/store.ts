import { create } from 'zustand';
import { Zone, ChatMessage, SimulationState } from './types';

interface CarbonStore {
  zones: Zone[];
  messages: ChatMessage[];
  selectedZoneId: string;
  simulation: SimulationState;
  updateZonePpm: (id: string, ppm: number) => void;
  selectZone: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateSimulation: (sim: Partial<SimulationState>) => void;
}

const INITIAL_ZONES: Zone[] = [
  {
    id: 'ramapuram',
    name: 'Ramapuram',
    ppm: 88,
    status: 'FAIR',
    aqi: 65,
    trend: [82, 85, 88, 86, 88],
    causes: [
      { name: 'Industrial', value: 45, color: '#ff3b3b' },
      { name: 'Traffic', value: 30, color: '#ff9500' },
      { name: 'Dust', value: 15, color: '#ffd60a' },
      { name: 'Others', value: 10, color: '#34c759' },
    ],
  },
  {
    id: 'velachery',
    name: 'Velachery',
    ppm: 148,
    status: 'MODERATE',
    aqi: 121,
    trend: [130, 140, 148, 145, 148],
    causes: [
      { name: 'Traffic', value: 55, color: '#ff3b3b' },
      { name: 'Construction', value: 25, color: '#ff9500' },
      { name: 'Waste Burning', value: 15, color: '#ffd60a' },
      { name: 'Others', value: 5, color: '#34c759' },
    ],
  },
  {
    id: 'perungudi',
    name: 'Perungudi',
    ppm: 120,
    status: 'MODERATE',
    aqi: 134,
    trend: [110, 115, 120, 118, 120],
    causes: [
      { name: 'Landfill Emissions', value: 60, color: '#ff3b3b' },
      { name: 'Industrial', value: 20, color: '#ff9500' },
      { name: 'Traffic', value: 15, color: '#ffd60a' },
      { name: 'Others', value: 5, color: '#34c759' },
    ],
  },
  {
    id: 'arumbakkam',
    name: 'Arumbakkam',
    ppm: 125,
    status: 'FAIR',
    aqi: 87,
    trend: [115, 120, 125, 122, 125],
    causes: [
      { name: 'Traffic', value: 50, color: '#ff3b3b' },
      { name: 'Commercial', value: 30, color: '#ff9500' },
      { name: 'Construction', value: 15, color: '#ffd60a' },
      { name: 'Others', value: 5, color: '#34c759' },
    ],
  },
  {
    id: 'alandur',
    name: 'Alandur',
    ppm: 93,
    status: 'FAIR',
    aqi: 102,
    trend: [88, 90, 93, 91, 93],
    causes: [
      { name: 'Traffic', value: 40, color: '#ff3b3b' },
      { name: 'Industrial', value: 35, color: '#ff9500' },
      { name: 'Construction', value: 20, color: '#ffd60a' },
      { name: 'Others', value: 5, color: '#34c759' },
    ],
  },
  {
    id: 'tambaram',
    name: 'Tambaram',
    ppm: 73,
    status: 'GOOD',
    aqi: 61,
    trend: [70, 72, 73, 71, 73],
    causes: [
      { name: 'Traffic', value: 40, color: '#ff3b3b' },
      { name: 'Dust', value: 30, color: '#ff9500' },
      { name: 'Industrial', value: 20, color: '#ffd60a' },
      { name: 'Others', value: 10, color: '#34c759' },
    ],
  },
  {
    id: 'tnagar',
    name: 'T. Nagar',
    ppm: 62,
    status: 'GOOD',
    aqi: 44,
    trend: [58, 60, 62, 61, 62],
    causes: [
      { name: 'Traffic', value: 65, color: '#ff3b3b' },
      { name: 'Commercial', value: 20, color: '#ff9500' },
      { name: 'Construction', value: 10, color: '#ffd60a' },
      { name: 'Others', value: 5, color: '#34c759' },
    ],
  },
];

export const useStore = create<CarbonStore>((set) => ({
  zones: INITIAL_ZONES,
  messages: [],
  selectedZoneId: 'velachery',
  simulation: {
    greenBelt: 20,
    traffic: 10,
    industrial: 5,
    projectedPpm: 148,
  },
  updateZonePpm: (id, ppm) =>
    set((state) => ({
      zones: state.zones.map((z) => {
        if (z.id !== id) return z;
        const status = ppm > 200 ? 'DANGEROUS' : ppm > 130 ? 'MODERATE' : ppm > 80 ? 'FAIR' : 'GOOD';
        return { ...z, ppm, status };
      }),
    })),
  selectZone: (id) => set({ selectedZoneId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages.slice(-3), message] })),
  updateSimulation: (sim) => set((state) => ({ simulation: { ...state.simulation, ...sim } })),
}));
