export interface GroundingStep {
  id: number;
  sense: string;
  count: number;
  prompt: string;
  subPrompt: string;
  breathInstruction: string;
}

export interface AudioExercise {
  id: string;
  title: string;
  duration: string;
  description: string;
  breathPattern: { inhale: number; hold: number; exhale: number; holdAfter?: number };
  cycles: number;
}

export interface CompanionResponse {
  keywords: string[];
  responses: string[];
}

export const groundingSteps: GroundingStep[] = [
  {
    id: 1,
    sense: 'SEE',
    count: 5,
    prompt: '5 things you can see',
    subPrompt: 'Look slowly around the room. Name each one quietly in your mind.',
    breathInstruction: 'Breathe slowly as you look.',
  },
  {
    id: 2,
    sense: 'TOUCH',
    count: 4,
    prompt: '4 things you can feel',
    subPrompt: 'Notice textures — your clothes, the surface beneath you, the air on your skin.',
    breathInstruction: 'Feel your feet pressed against the floor.',
  },
  {
    id: 3,
    sense: 'HEAR',
    count: 3,
    prompt: '3 sounds you can hear',
    subPrompt: 'Close your eyes if you like. Listen for distant sounds, nearby sounds.',
    breathInstruction: 'Let each breath be a sound you can hear.',
  },
  {
    id: 4,
    sense: 'SMELL',
    count: 2,
    prompt: '2 things you can smell',
    subPrompt: 'Take a slow, gentle breath through your nose. Notice even the faintest scent.',
    breathInstruction: 'Inhale slowly and deeply.',
  },
  {
    id: 5,
    sense: 'TASTE',
    count: 1,
    prompt: '1 thing you can taste',
    subPrompt: 'Notice any taste in your mouth. Run your tongue gently along your teeth.',
    breathInstruction: 'You are here. You are real.',
  },
];

export const audioExercises: AudioExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    duration: '5 min',
    description: 'A Navy SEAL technique. Inhale, hold, exhale, hold — each for 4 counts. Activates your parasympathetic nervous system.',
    breathPattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    cycles: 10,
  },
  {
    id: '4-7-8',
    title: '4-7-8 Breath',
    duration: '4 min',
    description: 'Dr. Andrew Weil\'s calming breath. A natural tranquilizer for the nervous system.',
    breathPattern: { inhale: 4, hold: 7, exhale: 8 },
    cycles: 8,
  },
  {
    id: 'coherent',
    title: 'Coherent Breathing',
    duration: '10 min',
    description: 'Breathe at 5 breaths per minute. Synchronizes heart rate variability and brings deep calm.',
    breathPattern: { inhale: 6, hold: 0, exhale: 6 },
    cycles: 20,
  },
  {
    id: 'extended-exhale',
    title: 'Extended Exhale',
    duration: '6 min',
    description: 'Longer exhales activate the rest-and-digest response. Inhale briefly, exhale slowly and fully.',
    breathPattern: { inhale: 4, hold: 0, exhale: 8 },
    cycles: 12,
  },
  {
    id: 'physiological-sigh',
    title: 'Physiological Sigh',
    duration: '3 min',
    description: 'Double inhale through the nose, then long exhale through the mouth. The fastest way to reduce acute stress.',
    breathPattern: { inhale: 2, hold: 1, exhale: 6 },
    cycles: 15,
  },
];

export const companionResponses: CompanionResponse[] = [
  {
    keywords: ['panic', 'panicking', 'attack', 'cant breathe', "can't breathe", 'suffocating'],
    responses: [
      'I am right here with you. Press your feet firmly into the floor. Feel that solid surface beneath you.',
      'The panic will pass. It always does. Breathe in slowly through your nose for 4 counts.',
      'You are safe in this moment. Your body is trying to protect you. Let it settle.',
    ],
  },
  {
    keywords: ['unreal', 'not real', 'dream', 'dreaming', 'fake', 'simulation', 'dpdr', 'depersonalization', 'derealization'],
    responses: [
      'That feeling of unreality is a known, temporary state. Your brain is overwhelmed and protecting you. You are real.',
      'Place your hand flat on your chest. Feel your heartbeat. That is you, real and present.',
      'Look for one object near you. Touch it. Notice its texture, temperature, weight. That is real. You are real.',
    ],
  },
  {
    keywords: ['dizzy', 'dizziness', 'spinning', 'lightheaded', 'faint', 'floating'],
    responses: [
      'Sit or lie down if you can. Plant both feet on the floor. Gravity is holding you.',
      'Look at a fixed point in front of you. Keep your eyes there. Breathe slowly.',
      'Dizziness often comes with shallow breathing. Try to slow your breath right down.',
    ],
  },
  {
    keywords: ['scared', 'afraid', 'terrified', 'fear', 'frightened'],
    responses: [
      'Your fear makes sense. Right now you are physically safe. The feeling is the danger, not the situation.',
      'Fear is a wave. You don\'t have to fight it. Let it move through you as you breathe.',
      'Name the fear out loud or in your head. Naming it gives you a little distance from it.',
    ],
  },
  {
    keywords: ['help', 'please', 'need help', 'assist'],
    responses: [
      'I am here. You are not alone in this. Start with one slow breath in through your nose.',
      'Let\'s do this together. First: press both feet into the floor. Good. Now breathe.',
      'You reached out. That was brave. Let\'s start with what you can feel right now.',
    ],
  },
  {
    keywords: ['alone', 'lonely', 'no one', 'nobody'],
    responses: [
      'You have this space. It is here whenever you need it. You are not alone.',
      'Many people know exactly how this feels. You are in good company, even now.',
      'Reach out to someone you trust if you can. Connection is one of the most powerful anchors.',
    ],
  },
  {
    keywords: ['crying', 'cry', 'tears', 'sobbing'],
    responses: [
      'Let yourself cry. It releases tension and is good for your nervous system.',
      'Crying is a natural release. Let the tears come without judgment.',
      'Your feelings are valid. Crying is your body processing what it holds.',
    ],
  },
  {
    keywords: ['heart', 'racing', 'palpitations', 'heart rate', 'chest'],
    responses: [
      'A racing heart is uncomfortable but not dangerous. It will slow down. Try breathing out longer than you breathe in.',
      'Place a hand on your heart. Breathe slowly. Feel each beat slow as you exhale.',
      'Slow, extended exhales activate your vagus nerve and calm your heart rate.',
    ],
  },
  {
    keywords: ['tired', 'exhausted', 'drained', 'worn out'],
    responses: [
      'Anxiety and dissociation are exhausting. Rest is medicine. Give yourself permission.',
      'It is okay to rest. You don\'t have to feel okay right now.',
      'Your body and mind are working hard. Rest when you can. This app will be here.',
    ],
  },
  {
    keywords: ['better', 'okay', 'calm', 'settled', 'good', 'thank', 'thanks'],
    responses: [
      'I\'m really glad. Keep breathing. Stay with this feeling as long as you can.',
      'That\'s wonderful. You did the work. Remember this feeling — you can return to it.',
      'Well done for staying with it. You can close your eyes and rest in this calm for a moment.',
    ],
  },
];

export const companionFallbackResponses: string[] = [
  'Stay with your breath. In through the nose, out through the mouth. Slow and steady.',
  'You are here. This moment is real. Place one hand on your heart.',
  'Take a slow breath in... hold gently... and breathe all the way out.',
  'What can you feel right now? Describe one sensation — a texture, a temperature.',
  'Look for something blue in the room. Just one thing. Focus on it for a moment.',
  'You are doing well by being here. One breath at a time.',
  'Notice the weight of your body in the chair or on the floor. Let it hold you.',
];

export const companionGreeting =
  'Hello. I\'m here with you. Whatever you\'re feeling right now, this is a safe space.\n\nTell me what\'s happening, or just say hello. I\'m listening.';
