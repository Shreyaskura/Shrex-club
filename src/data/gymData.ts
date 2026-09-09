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
    id: 'chest',
    name: 'CHEST (PECTORALIS MAJOR)',
    description: 'The primary pushing muscle group responsible for horizontal adduction and upper torso power.',
    biomechanics: 'Scapular stability with full elbow extension under load.',
    recommendedExercises: [
      { name: 'Flat Incline Barbell Press', sets: '4 Sets × 8-10 Reps', target: 'Upper Pectoralis & Anterior Deltoid' },
      { name: 'Incline Heavy Dumbbell Press', sets: '3 Sets × 10-12 Reps', target: 'Clavicular Head Hypertrophy' },
      { name: 'Low-to-High Cable Crossovers', sets: '3 Sets × 15 Reps', target: 'Inner Squeeze & Peak Isolation' },
      { name: 'Weighted Parallel Bar Dips', sets: '4 Sets × 8 Reps', target: 'Lower Sternal Margin' }
    ]
  },
  {
    id: 'shoulders',
    name: 'SHOULDERS (DELTOIDS)',
    description: 'Tri-headed muscle complex giving 3D width, cap appearance, and shoulder girdle mobility.',
    biomechanics: 'Abduction in the scapular plane with strict core bracing.',
    recommendedExercises: [
      { name: 'Standing Overhead Military Press', sets: '4 Sets × 6 Reps', target: 'Anterior Deltoid & Core Rigidity' },
      { name: 'Lean-Away DB Lateral Raises', sets: '4 Sets × 15 Reps', target: 'Lateral Deltoid Width' },
      { name: 'Face Pulls with Rope Cable', sets: '3 Sets × 20 Reps', target: 'Posterior Deltoid & External Rotators' },
      { name: 'Seated Arnold Dumbbell Press', sets: '3 Sets × 10 Reps', target: 'Full Deltoid Complex' }
    ]
  },
  {
    id: 'arms',
    name: 'ARMS (BICEPS & TRICEPS)',
    description: 'Arm flexors and extensors essential for arm girth, lock-out strength, and pulling mechanics.',
    biomechanics: 'Elbow flex/extension with isolated humerus positioning.',
    recommendedExercises: [
      { name: 'EZ-Bar Incline Preacher Curl', sets: '4 Sets × 12 Reps', target: 'Short Head Biceps Isolation' },
      { name: 'Heavy Incline Skullcrushers', sets: '4 Sets × 10 Reps', target: 'Triceps Long Head Power' },
      { name: 'Cable Rope Pushdowns', sets: '3 Sets × 15 Reps', target: 'Triceps Lateral Head Peak' },
      { name: 'Hammer Curls with Rope', sets: '3 Sets × 12 Reps', target: 'Brachialis & Brachioradialis' }
    ]
  },
  {
    id: 'back',
    name: 'BACK (LATISSIMUS & TRAPEZIUS)',
    description: 'The massive posterior chain upper engine responsible for V-taper aesthetics and pulling horsepower.',
    biomechanics: 'Vertical pulling down and horizontal row retraction.',
    recommendedExercises: [
      { name: 'Conventional Heavy Deadlifts', sets: '5 Sets × 5 Reps', target: 'Total Spinal Erector & Posterior Density' },
      { name: 'Weighted Neutral Grip Pull-Ups', sets: '4 Sets × 8 Reps', target: 'Latissimus Dorsi Width' },
      { name: 'Chest-Supported T-Bar Rows', sets: '4 Sets × 10 Reps', target: 'Rhomboid & Mid-Trap Thickness' },
      { name: 'Single-Arm Dumbbell Rows', sets: '3 Sets × 12 Reps', target: 'Lower Lat Tie-In' }
    ]
  },
  {
    id: 'core',
    name: 'CORE (ABS & OBLIQUES)',
    description: 'The central stabilization hub connecting upper body power to lower body force generation.',
    biomechanics: 'Anti-rotation, pelvic tilt control, and trunk flexion.',
    recommendedExercises: [
      { name: 'Hanging Leg Raises with Hold', sets: '4 Sets × 15 Reps', target: 'Lower Rectus Abdominis' },
      { name: 'Heavy Ab Cable Kneeling Crunches', sets: '4 Sets × 20 Reps', target: 'Upper Core Muscle Density' },
      { name: 'Ab Wheel Rollouts', sets: '3 Sets × 12 Reps', target: 'Deep Transverse Abdominis' },
      { name: 'Woodchopper Cable Rotations', sets: '3 Sets × 15 Reps', target: 'External & Internal Obliques' }
    ]
  },
  {
    id: 'legs',
    name: 'LEGS (QUADRICEPS & HAMSTRINGS)',
    description: 'The foundation of human power: Quads, Hamstrings, Glutes, and Calves.',
    biomechanics: 'Deep knee flexion and hip hinge power drive.',
    recommendedExercises: [
      { name: 'Olympic High-Bar Back Squats', sets: '5 Sets × 5 Reps', target: 'Quadriceps Sweep & Glute Power' },
      { name: 'Romanian Dumbbell Deadlifts', sets: '4 Sets × 10 Reps', target: 'Hamstring Stretch & Glute Tie-In' },
      { name: '45° Heavy Leg Press', sets: '4 Sets × 12 Reps', target: 'Vastus Medialis (Teardrop)' },
      { name: 'Seated Hamstring Curls', sets: '3 Sets × 15 Reps', target: 'Biceps Femoris Isolation' }
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
