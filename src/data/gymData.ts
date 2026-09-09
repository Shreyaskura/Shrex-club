export interface Program {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  intensity: string;
  duration: string;
  features: string[];
}

export interface MuscleInfo {
  id: string;
  name: string;
  description: string;
  biomechanics: string;
  recommendedExercises: {
    name: string;
    sets: string;
    target: string;
  }[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  image: string;
  specialties: string[];
  bio: string;
  socials: { instagram: string; twitter: string; linkedin: string };
}

export interface Transformation {
  id: string;
  name: string;
  duration: string;
  program: string;
  beforeImg: string;
  afterImg: string;
  metrics: {
    strength: string;
    endurance: string;
    consistency: string;
    bodyFatChange: string;
  };
  quote: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  highlighted?: boolean;
  badge?: string;
  features: string[];
}

export interface ClassSession {
  id: string;
  title: string;
  time: string;
  trainer: string;
  capacity: string;
  enrolled: number;
  max: number;
  category: string;
  day: string;
  isLive?: boolean;
}

export interface Facility {
  id: string;
  number: string;
  name: string;
  description: string;
  specs: string[];
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Training' | 'Equipment' | 'Boxing' | 'Cardio' | 'Community';
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  program: string;
  image: string;
  content: string;
  rating: number;
  achievement: string;
}

export const PROGRAMS: Program[] = [
  {
    id: 'strength',
    number: '01',
    title: 'STRENGTH TRAINING',
    subtitle: 'HYPERTROPHY & POWER',
    description: 'Heavy progressive overload protocols designed by elite biomechanical specialists to build raw power and muscular density.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    intensity: 'High',
    duration: '60 Min',
    features: ['Custom Barbell Rig Access', '1-on-1 Form Analysis', 'Progressive Overload Tracking', 'Velocity-Based Training']
  },
  {
    id: 'bodybuilding',
    number: '02',
    title: 'BODYBUILDING',
    subtitle: 'SCULPT & SYMMETRY',
    description: 'Targeted muscular isolation, high-volume hypertrophy blocks, and aesthetic physique sculpting using custom custom steel equipment.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1200',
    intensity: 'Extreme',
    duration: '75 Min',
    features: ['Custom Cable Rigs', 'Time-Under-Tension Focus', 'Posing & Symmetry Coaching', 'Intra-Workout Fuel Support']
  },
  {
    id: 'crossfit',
    number: '03',
    title: 'CROSSFIT & FUNCTIONAL',
    subtitle: 'TACTICAL CONDITIONING',
    description: 'High-intensity functional movements combining Olympic weightlifting, gymnastics, and aerobic metabolic conditioning.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    intensity: 'Maximum',
    duration: '50 Min',
    features: ['Rogue Rig & Assault Bikes', 'Leaderboard Tracking', 'Workouts of the Day (WOD)', 'Metabolic Rate Optimization']
  },
  {
    id: 'boxing',
    number: '04',
    title: 'BOXING & COMBAT',
    subtitle: 'SPEED & REFLEXES',
    description: 'Pro-style boxing technique, heavy bag conditioning, mitt work, and explosive rotational core agility drills.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1200',
    intensity: 'High',
    duration: '60 Min',
    features: ['Official Fight Ring', 'Heavy Bag Arena', 'Sparring & Pad Work', 'Hand-Eye Reflex Drills']
  },
  {
    id: 'cardio',
    number: '05',
    title: 'HIGH OCTANE CARDIO',
    subtitle: 'ENDURANCE & FAT LOSS',
    description: 'Futuristic VO2-max cardio zone featuring Skillmills, Woodway treadmills, and live heart-rate telemetry tracking.',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=1200',
    intensity: 'Moderate-High',
    duration: '45 Min',
    features: ['Heart Rate Zone Monitoring', 'Curved Motorless Treadmills', 'HIIT Sprints & Rowing', 'Caloric Burn Analytics']
  },
  {
    id: 'yoga',
    number: '06',
    title: 'YOGA & RECOVERY',
    subtitle: 'MOBILITY & MINDFULNESS',
    description: 'Active recovery, joint decompression, myofascial release, and deep athletic mobility flows for injury prevention.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    intensity: 'Balanced',
    duration: '60 Min',
    features: ['Infrared Studio', 'Postural Correction', 'Decompression Straps', 'Breathwork & Sauna Recovery']
  }
];

export const MUSCLE_GROUPS: MuscleInfo[] = [
  {
    id: 'upper-chest',
    name: 'UPPER CHEST (CLAVICULAR HEAD)',
    description: 'The clavicular head of the pectoralis major fills out the upper torso beneath the collarbone for an armored chest aesthetic.',
    biomechanics: 'Shoulder flexion with horizontal adduction at a 30° to 45° incline angle.',
    recommendedExercises: [
      { name: '30° Incline Dumbbell Press', sets: '4 Sets × 8-10 Reps', target: 'Clavicular Pectoral Fibers' },
      { name: 'Low-to-High Cable Flyes', sets: '3 Sets × 12-15 Reps', target: 'Upper Sternum Squeeze' },
      { name: 'Incline Smith Machine Press', sets: '4 Sets × 8 Reps', target: 'Heavy Hypertrophic Overload' },
      { name: 'Reverse-Grip Barbell Bench', sets: '3 Sets × 10 Reps', target: 'Upper Pec Activation' }
    ]
  },
  {
    id: 'mid-chest',
    name: 'MIDDLE CHEST (STERNAL HEAD)',
    description: 'The main mass builder of the chest providing sheer pushing force, thick pectoral plates, and horizontal power.',
    biomechanics: 'Pure horizontal adduction with full shoulder retraction and locked scapula.',
    recommendedExercises: [
      { name: 'Flat Barbell Bench Press', sets: '4 Sets × 6-8 Reps', target: 'Maximal Strength & Sternal Pecs' },
      { name: 'Flat Dumbbell Press with Deep Stretch', sets: '4 Sets × 10 Reps', target: 'Outer Chest Fiber Stretch' },
      { name: 'Seated Plate-Loaded Chest Press', sets: '3 Sets × 12 Reps', target: 'Continuous Tension Hypertrophy' },
      { name: 'Pec Deck Machine Flyes', sets: '3 Sets × 15 Reps', target: 'Inner Chest Peak Contraction' }
    ]
  },
  {
    id: 'lower-chest',
    name: 'LOWER CHEST (ABDOMINAL HEAD)',
    description: 'The lower pectoral border that carves a sharp, defined underline separating the chest from the upper abdomen.',
    biomechanics: 'Downward horizontal adduction and shoulder extension with forward lean.',
    recommendedExercises: [
      { name: 'Weighted Chest Dips (Forward Lean)', sets: '4 Sets × 8-10 Reps', target: 'Lower Pectoral Margin & Cut' },
      { name: 'High-to-Low Cable Flyes', sets: '4 Sets × 12-15 Reps', target: 'Lower Sternal Peak Contraction' },
      { name: 'Decline Dumbbell Bench Press', sets: '3 Sets × 10-12 Reps', target: 'Targeted Lower Head Hypertrophy' },
      { name: 'Decline Hammer Strength Press', sets: '3 Sets × 10 Reps', target: 'Isolated Lower Chest Drive' }
    ]
  },
  {
    id: 'glutes',
    name: 'GLUTES (GLUTEUS MAXIMUS & MEDIUS)',
    description: 'The largest and strongest muscle engine in the human body, vital for sprinting, explosive jumping, deadlifts, and hip stabilization.',
    biomechanics: 'Hip extension, external rotation, and pelvic abduction under posterior chain load.',
    recommendedExercises: [
      { name: 'Heavy Barbell Hip Thrusts', sets: '4 Sets × 8-10 Reps', target: 'Gluteus Maximus Peak Lockout' },
      { name: 'Deficit Bulgarian Split Squats', sets: '3 Sets × 10 Reps/leg', target: 'Deep Glute Stretch & Growth' },
      { name: 'Standing Cable Glute Kickbacks', sets: '3 Sets × 15 Reps', target: 'Upper Glute Shelf Isolation' },
      { name: 'Seated Machine Hip Abduction', sets: '4 Sets × 15-20 Reps', target: 'Gluteus Medius & Hip Stability' }
    ]
  },
  {
    id: 'quads',
    name: 'QUADS (QUADRICEPS FEMORIS)',
    description: 'The front four-headed thigh powerhouse: Rectus Femoris, Vastus Lateralis, Vastus Medialis (teardrop), and Vastus Intermedius.',
    biomechanics: 'Knee extension under deep flexion with controlled knee-tracking over toes.',
    recommendedExercises: [
      { name: 'Olympic High-Bar Squats', sets: '4 Sets × 6-8 Reps', target: 'Total Quad Sweep & Core Bracing' },
      { name: '45° Heavy Incline Leg Press', sets: '4 Sets × 10-12 Reps', target: 'Vastus Lateralis Outer Sweep' },
      { name: 'Hack Squats (Full Depth)', sets: '3 Sets × 10 Reps', target: 'Vastus Medialis (Teardrop)' },
      { name: 'Leg Extensions with 2s Squeeze', sets: '3 Sets × 15 Reps', target: 'Rectus Femoris Peak Isolation' }
    ]
  },
  {
    id: 'hamstrings',
    name: 'HAMSTRINGS (POSTERIOR CHAIN)',
    description: 'The bi-articular muscle group that flexes the knee and extends the hip, preventing knee injuries and providing rear leg density.',
    biomechanics: 'Hip hinge extension and knee flexion under eccentric control.',
    recommendedExercises: [
      { name: 'Romanian Dumbbell/Barbell Deadlifts (RDL)', sets: '4 Sets × 8-10 Reps', target: 'Deep Hamstring Eccentric Stretch' },
      { name: 'Seated Hamstring Leg Curls', sets: '4 Sets × 12 Reps', target: 'Biceps Femoris in Flexed Hip' },
      { name: 'Lying Prone Leg Curls', sets: '3 Sets × 12-15 Reps', target: 'Semitendinosus Peak Contraction' },
      { name: 'Nordic Hamstring Curls', sets: '3 Sets × 6-8 Reps', target: 'Eccentric Strength & Injury Shield' }
    ]
  },
  {
    id: 'calves',
    name: 'CALVES (GASTROCNEMIUS & SOLEUS)',
    description: 'Lower leg stabilizers responsible for plantar flexion, sprinting push-off, and diamond-shaped aesthetic lower leg definition.',
    biomechanics: 'Plantar flexion with full ankle dorsiflexion stretch and pause at top.',
    recommendedExercises: [
      { name: 'Standing Calf Raises (Legs Straight)', sets: '4 Sets × 12-15 Reps', target: 'Gastrocnemius Diamond Heads' },
      { name: 'Seated Calf Raises (Knees Bent 90°)', sets: '4 Sets × 15-20 Reps', target: 'Deep Soleus Muscle Layer' },
      { name: 'Leg Press Toe Presses', sets: '3 Sets × 15 Reps', target: 'Heavy Plantar Extension' },
      { name: 'Single-Leg Dumbbell Calf Raises', sets: '3 Sets × 15 Reps/leg', target: 'Unilateral Ankle Stability' }
    ]
  },
  {
    id: 'lats',
    name: 'LATS (LATISSIMUS DORSI - V-TAPER)',
    description: 'The widest muscle of the upper body creating the coveted V-taper physique, essential for pulling power and back width.',
    biomechanics: 'Shoulder adduction and vertical pull driving elbows down to hip crest.',
    recommendedExercises: [
      { name: 'Weighted Neutral-Grip Pull-Ups', sets: '4 Sets × 6-8 Reps', target: 'Upper & Outer Lat Width' },
      { name: 'Single-Arm Neutral Cable Lat Pulldowns', sets: '4 Sets × 10-12 Reps', target: 'Lower Lat Iliac Fiber Alignment' },
      { name: 'Chest-Supported Dumbbell Rows', sets: '3 Sets × 10 Reps', target: 'Mid-to-Lower Lat Thickness' },
      { name: 'Straight-Arm Rope Cable Pullovers', sets: '3 Sets × 15 Reps', target: 'Isolated Lat Stretch & Sweep' }
    ]
  },
  {
    id: 'traps',
    name: 'TRAPS & UPPER BACK (RHOMBOIDS)',
    description: 'The massive diamond-shaped muscle across the neck and mid-back giving thick 3D yoke density and shoulder girdle health.',
    biomechanics: 'Scapular elevation, upward rotation, and middle retraction.',
    recommendedExercises: [
      { name: 'Heavy Barbell Shrugs (2s Top Hold)', sets: '4 Sets × 10-12 Reps', target: 'Upper Trapezius Yoke' },
      { name: 'Chest-Supported T-Bar Rows', sets: '4 Sets × 10 Reps', target: 'Mid Traps & Rhomboid Thickness' },
      { name: 'Kelso Shrugs on Incline Bench', sets: '3 Sets × 15 Reps', target: 'Lower & Mid Trapezius Control' },
      { name: 'Face Pulls with High Rope Anchor', sets: '4 Sets × 15-20 Reps', target: 'Lower Traps & Postural Stability' }
    ]
  },
  {
    id: 'lower-back',
    name: 'LOWER BACK (ERECTOR SPINAE)',
    description: 'The spinal pillars running along the vertebral column providing anti-flexion core strength, posture, and heavy lift support.',
    biomechanics: 'Isometric spinal stabilization and controlled hip extension.',
    recommendedExercises: [
      { name: 'Conventional Heavy Deadlifts', sets: '4 Sets × 5 Reps', target: 'Total Spinal Erector Density' },
      { name: '45° Weighted Back Hyperextensions', sets: '3 Sets × 12 Reps', target: 'Lumbar Erector Spinae' },
      { name: 'Good Mornings with Barbell', sets: '3 Sets × 8-10 Reps', target: 'Posterior Chain Hinge Bracing' },
      { name: 'Heavy Suitcase Carries', sets: '3 Sets × 40 Meters', target: 'Anti-Lateral Flexion Stability' }
    ]
  },
  {
    id: 'front-delts',
    name: 'FRONT DELTS (ANTERIOR DELTOID)',
    description: 'The forward head of the shoulder muscle providing pushing drive and upper chest shoulder tie-in.',
    biomechanics: 'Shoulder forward flexion with strict scapular retraction.',
    recommendedExercises: [
      { name: 'Standing Overhead Barbell Military Press', sets: '4 Sets × 6-8 Reps', target: 'Anterior Deltoid & Core Bracing' },
      { name: 'Seated Dumbbell Shoulder Press', sets: '3 Sets × 8-10 Reps', target: 'Isolated Vertical Shoulder Power' },
      { name: 'Incline Cable Front Raises', sets: '3 Sets × 12 Reps', target: 'Continuous Tension Front Head' },
      { name: 'Arnold Dumbbell Press', sets: '3 Sets × 10 Reps', target: 'Rotational Deltoid Engagement' }
    ]
  },
  {
    id: 'side-delts',
    name: 'SIDE DELTS (LATERAL DELTOID - 3D WIDTH)',
    description: 'The middle deltoid head responsible for widening the upper body frame and creating capped, boulder shoulders.',
    biomechanics: 'Shoulder abduction in the scapular plane with thumb-neutral tilt.',
    recommendedExercises: [
      { name: 'Behind-the-Back Cable Lateral Raises', sets: '4 Sets × 12-15 Reps', target: 'Constant Lateral Deltoid Tension' },
      { name: 'Dumbbell Lateral Raises (Strict Form)', sets: '4 Sets × 15 Reps', target: 'Side Delt Width & Cap' },
      { name: 'Upright Rows (Wide Cable Grip)', sets: '3 Sets × 12 Reps', target: 'Lateral Deltoid & Upper Trap' },
      { name: 'Chest-Supported Incline Lateral Raises', sets: '3 Sets × 15 Reps', target: 'Zero-Momentum Strict Isolation' }
    ]
  },
  {
    id: 'rear-delts',
    name: 'REAR DELTS (POSTERIOR DELTOID)',
    description: 'The posterior shoulder head that balances the shoulder joint, prevents hunched posture, and gives a rounded 3D appearance.',
    biomechanics: 'Horizontal abduction and external rotation of the humerus.',
    recommendedExercises: [
      { name: 'Reverse Pec Deck Flyes', sets: '4 Sets × 15 Reps', target: 'Posterior Deltoid Peak Contraction' },
      { name: 'Cable Face Pulls with External Rotation', sets: '4 Sets × 15-20 Reps', target: 'Rear Delt & Rotator Cuff Health' },
      { name: 'Bent-Over Incline Dumbbell Flyes', sets: '3 Sets × 12-15 Reps', target: 'Rear Delt Fiber Hypertrophy' },
      { name: 'Cross-Cable Rear Delt Crossovers', sets: '3 Sets × 15 Reps', target: 'Deep Rear Shoulder Stretch' }
    ]
  },
  {
    id: 'biceps',
    name: 'BICEPS (LONG & SHORT HEADS)',
    description: 'The anterior arm flexors: Long head (outer peak) and Short head (inner thickness), plus the Brachialis underneath.',
    biomechanics: 'Elbow flexion and forearm supination with stationary elbows.',
    recommendedExercises: [
      { name: 'Incline Dumbbell Biceps Curls', sets: '4 Sets × 10 Reps', target: 'Long Head Maximum Stretch' },
      { name: 'EZ-Bar Preacher Curls', sets: '3 Sets × 10-12 Reps', target: 'Short Head Inner Thickness' },
      { name: 'Cross-Body Hammer Curls', sets: '3 Sets × 12 Reps', target: 'Brachialis & Arm Girth' },
      { name: 'Bayesian Cable Curls (Behind Back)', sets: '3 Sets × 15 Reps', target: 'Peak Contraction & Tension' }
    ]
  },
  {
    id: 'triceps',
    name: 'TRICEPS (LONG, LATERAL & MEDIAL HEADS)',
    description: 'Making up 60% of upper arm size, the three-headed triceps muscle extends the elbow and provides locking power.',
    biomechanics: 'Elbow extension with humerus elevated for long head or fixed for lateral head.',
    recommendedExercises: [
      { name: 'Overhead Cable Rope Triceps Extensions', sets: '4 Sets × 12 Reps', target: 'Long Head Full Hypertrophic Stretch' },
      { name: 'Incline Barbell Skull Crushers', sets: '4 Sets × 8-10 Reps', target: 'Long & Medial Head Power' },
      { name: 'V-Bar Cable Pushdowns', sets: '3 Sets × 12-15 Reps', target: 'Lateral Head Outer Horseshoe' },
      { name: 'Close-Grip Barbell Bench Press', sets: '3 Sets × 8 Reps', target: 'Massive Triceps Overload' }
    ]
  },
  {
    id: 'forearms',
    name: 'FOREARMS & GRIP (FLEXORS & BRACHIORADIALIS)',
    description: 'Essential for crushing grip strength, heavy deadlifts, pull-ups, and dense vascular lower arms.',
    biomechanics: 'Wrist flexion, extension, and isometric grip holding.',
    recommendedExercises: [
      { name: 'Standing Barbell Behind-the-Back Wrist Curls', sets: '4 Sets × 15-20 Reps', target: 'Wrist Flexor Density' },
      { name: 'Reverse EZ-Bar Bicep/Forearm Curls', sets: '3 Sets × 12 Reps', target: 'Brachioradialis Muscle Ridge' },
      { name: 'Heavy Dumbbell Farmer\'s Carries', sets: '3 Sets × 45 Seconds', target: 'Crushing Isometric Grip' },
      { name: 'Dead Hangs from Pull-Up Bar', sets: '3 Sets × Max Time', target: 'Tendon Strength & Decompression' }
    ]
  },
  {
    id: 'abs',
    name: 'ABS (RECTUS ABDOMINIS - 6-PACK)',
    description: 'The front vertical core muscle responsible for spine flexion and pulling the ribcage toward the pelvis for defined abdominal bricks.',
    biomechanics: 'Spinal flexion through posterior pelvic tilt under resistance.',
    recommendedExercises: [
      { name: 'Hanging Leg Raises with Pelvic Tilt', sets: '4 Sets × 12-15 Reps', target: 'Lower Rectus Abdominis' },
      { name: 'Kneeling Cable Rope Crunches', sets: '4 Sets × 15-20 Reps', target: 'Weighted Upper & Mid Abs' },
      { name: 'Ab Wheel Rollouts from Knees', sets: '3 Sets × 10-12 Reps', target: 'Deep Core Bracing & Anti-Extension' },
      { name: 'Decline Bench Weighted Crunches', sets: '3 Sets × 15 Reps', target: 'Upper Abdominal Hypertrophy' }
    ]
  },
  {
    id: 'obliques',
    name: 'OBLIQUES & SERRATUS (ROTATIONAL CORE)',
    description: 'The diagonal abdominal wall muscles that frame the six-pack, create the tapered waist, and power rotational torque.',
    biomechanics: 'Torso rotation and lateral spine flexion against tension.',
    recommendedExercises: [
      { name: 'Standing Cable Woodchoppers (High-to-Low)', sets: '3 Sets × 15 Reps/side', target: 'External & Internal Oblique Torque' },
      { name: 'Hanging Windshield Wipers', sets: '3 Sets × 10 Reps/side', target: 'Advanced Oblique & Serratus Control' },
      { name: 'Weighted Side Planks with Hip Dips', sets: '3 Sets × 12 Reps/side', target: 'Lateral Core Endurance' },
      { name: 'Russian Twists with Medicine Ball', sets: '3 Sets × 20 Reps', target: 'High-Rep Rotational Burn' }
    ]
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 'arjun-sharma',
    name: 'ARJUN SHARMA',
    role: 'Head of Strength & Performance',
    experience: '8 Years Experience',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=800',
    specialties: ['Powerlifting', 'Hypertrophy Science', 'Biomechanical Form'],
    bio: 'Former national strength competitor and CSCS certified specialist. Focuses on heavy progressive overload and structural body symmetry.',
    socials: { instagram: '#', twitter: '#', linkedin: '#' }
  },
  {
    id: 'vikram-rathore',
    name: 'VIKRAM RATHORE',
    role: 'Physique & Bodybuilding Specialist',
    experience: '10 Years Experience',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800',
    specialties: ['Pro Bodybuilding', 'Contest Prep', 'Macro Nutrition'],
    bio: 'IFBB Pro athlete with over a decade coaching top physique transformation clients. Master of tension-based muscle activation.',
    socials: { instagram: '#', twitter: '#', linkedin: '#' }
  },
  {
    id: 'maya-lin',
    name: 'MAYA LIN',
    role: 'CrossFit & Conditioning Lead',
    experience: '6 Years Experience',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    specialties: ['CrossFit Games Coach', 'VO2 Max Systems', 'Agility & Speed'],
    bio: 'High-intensity conditioning strategist dedicated to pushing athletic limits through functional velocity and stamina training.',
    socials: { instagram: '#', twitter: '#', linkedin: '#' }
  },
  {
    id: 'marcus-vance',
    name: 'MARCUS VANCE',
    role: 'Combat & Tactical Boxing Coach',
    experience: '9 Years Experience',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    specialties: ['Pro Boxing', 'Footwork & Agility', 'High Caloric Burn'],
    bio: 'Golden Gloves champion training athletes in fight science, defensive head movement, and explosive rotational power.',
    socials: { instagram: '#', twitter: '#', linkedin: '#' }
  }
];

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 'trans-1',
    name: 'Rohan Mehta',
    duration: '12 WEEK TRANSFORMATION',
    program: 'Hypertrophy & Strength System',
    beforeImg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    metrics: {
      strength: '+45% Increase',
      endurance: '+60% VO2 Max',
      consistency: '96% Attendance',
      bodyFatChange: '-8.5% Body Fat'
    },
    quote: 'SHREX CLUB completely changed how I approach discipline. The data-driven programming is unmatched.'
  },
  {
    id: 'trans-2',
    name: 'Ananya Roy',
    duration: '16 WEEK TRANSFORMATION',
    program: 'Athletic Conditioning & Sculpt',
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    metrics: {
      strength: '+35% Deadlift',
      endurance: '+80% Stamina',
      consistency: '100% On Plan',
      bodyFatChange: 'Lean Athletic Recomp'
    },
    quote: 'Focusing on strength numbers rather than just scale weight made all the difference in my confidence.'
  }
];

export const MEMBERSHIPS: MembershipPlan[] = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    price: '₹1,499',
    billingPeriod: '/ month',
    description: 'Designed for independent athletes who demand access to world-class heavy steel and functional zones.',
    features: [
      'Full Gym & Free Weight Floor Access',
      'Cardio & Telemetry Arena Access',
      'Luxury Locker & Steam Room Access',
      'Basic Biomechanical Fitness Assessment',
      'SHREX Mobile App Portal Access'
    ]
  },
  {
    id: 'performance',
    name: 'PERFORMANCE',
    price: '₹2,999',
    billingPeriod: '/ month',
    description: 'Our most popular tier. Includes unlimited group classes, custom workout programming, and macro coaching.',
    highlighted: true,
    badge: 'MOST POPULAR',
    features: [
      'Everything in Essential Tier',
      'Unlimited High-Octane Group Classes',
      'Customized Progressive Workout Plan',
      'Monthly InBody Body Composition Scans',
      'Priority Class & Equipment Reservations',
      '1 Guest Pass Per Month'
    ]
  },
  {
    id: 'elite',
    name: 'ELITE VIP',
    price: '₹5,999',
    billingPeriod: '/ month',
    description: 'The pinnacle luxury fitness package. Personal trainer dedicated sessions, recovery lounge, and nutrition concierge.',
    features: [
      'Everything in Performance Tier',
      '4 Personal Trainer Sessions / Month',
      'Custom Macro & Nutrition Concierge',
      'Cryotherapy & Infrared Recovery Lounge',
      'Reserved Private VIP Locker & Kit Care',
      'Unlimited All-Access Guest Passes'
    ]
  }
];

export const CLASS_SCHEDULE: ClassSession[] = [
  {
    id: 'c1',
    title: 'CROSSFIT & METCON',
    time: '09:00 AM — 10:00 AM',
    trainer: 'Rahul',
    capacity: '14 / 20',
    enrolled: 14,
    max: 20,
    category: 'CrossFit',
    day: 'Today',
    isLive: true
  },
  {
    id: 'c2',
    title: 'HEAVY STRENGTH & POWER',
    time: '10:30 AM — 11:30 AM',
    trainer: 'Arjun Sharma',
    capacity: '18 / 20',
    enrolled: 18,
    max: 20,
    category: 'Strength',
    day: 'Today'
  },
  {
    id: 'c3',
    title: 'PRO BOXING & MITT WORK',
    time: '04:00 PM — 05:00 PM',
    trainer: 'Marcus Vance',
    capacity: '10 / 15',
    enrolled: 10,
    max: 15,
    category: 'Boxing',
    day: 'Today'
  },
  {
    id: 'c4',
    title: 'VO2 MAX CARDIO SPRINT',
    time: '06:00 PM — 07:00 PM',
    trainer: 'Maya Lin',
    capacity: '12 / 20',
    enrolled: 12,
    max: 20,
    category: 'Cardio',
    day: 'Today'
  },
  {
    id: 'c5',
    title: 'ATHLETIC MOBILITY & YOGA',
    time: '07:30 PM — 08:30 PM',
    trainer: 'Vikram Rathore',
    capacity: '08 / 15',
    enrolled: 8,
    max: 15,
    category: 'Yoga',
    day: 'Today'
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'f1',
    number: '01',
    name: 'STRENGTH FLOOR',
    description: 'Custom competition-grade power racks, calibrated steel plates, and custom knurled barbells.',
    specs: ['12 Power Racks', 'Calibrated Steel Plates', 'Dumbbells up to 70kg'],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'f2',
    number: '02',
    name: 'CARDIO ARENA',
    description: 'Biomechanical curved treadmills, Wattbikes, and real-time heart rate LED telemetry screen walls.',
    specs: ['Woodway Treadmills', 'Skillmills', 'Live Heart-Rate Walls'],
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'f3',
    number: '03',
    name: 'BOXING ZONE',
    description: 'Full-sized elevated boxing ring, water bags, speed bags, and leather heavy bag forest.',
    specs: ['Elevated Ring', '10 Heavy Bags', 'Speed & Slip Bags'],
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'f4',
    number: '04',
    name: 'FUNCTIONAL TRAINING',
    description: 'Custom Rogue turf lanes, sled tracks, kettlebell matrix, and plyometric jump towers.',
    specs: ['30m Sled Track', 'Monster Rogue Rig', 'Plyo & Kettlebells'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'f5',
    number: '05',
    name: 'RECOVERY AREA',
    description: 'Full cryotherapy chambers, infrared dry sauna rooms, cold plunge tubs, and massage guns.',
    specs: ['Infrared Sauna', 'Cold Plunge -2°C', 'Theragun Lounge'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Heavy Barbell Platform',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'g2',
    title: 'Night Training Atmosphere',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'g3',
    title: 'Pro Fight Ring',
    category: 'Boxing',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'g4',
    title: 'Cardio Telemetry Zone',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'g5',
    title: 'SHREX Athlete Community',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'g6',
    title: 'Infrared Recovery Suite',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Karan Malhotra',
    role: 'Tech Founder & Powerlifter',
    program: 'Strength & Performance',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    content: 'SHREX CLUB is unlike any fitness facility in Hyderabad. The equipment calibration, lighting, and community push you to surpass every benchmark.',
    rating: 5,
    achievement: '+50kg Squat PR in 5 Months'
  },
  {
    id: 't2',
    name: 'Dr. Sneha Reddy',
    role: 'Orthopedic Surgeon',
    program: 'Athletic Mobility & Conditioning',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    content: 'As a medical professional, I appreciate their focus on correct joint biomechanics. The trainers are deeply knowledgeable and safety-focused.',
    rating: 5,
    achievement: 'Zero Joint Pain & Peak Endurance'
  },
  {
    id: 't3',
    name: 'Aditya Verma',
    role: 'Software Architect',
    program: 'Bodybuilding & Macro Coaching',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    content: 'The macro calculator and AI assistant integration make tracking my daily performance effortless. Best club in the state.',
    rating: 5,
    achievement: 'Gained 7kg Lean Muscle Mass'
  }
];
