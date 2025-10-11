/**
 * Mock Blog Posts Data
 *
 * Sample blog posts for development and testing.
 * Provides realistic content covering all categories and features.
 */

import type { BlogPost, Author } from "../types/blog";

/**
 * Mock Author - Deirdre, The Reiki Goddess
 */
export const mockAuthor: Author = {
  name: "Deirdre, The Reiki Goddess",
  bio: "Certified Reiki Master and Sound Healing Practitioner with over 15 years of experience.",
  image: "/img/author-deirdre.jpg",
  role: "Founder & Reiki Master",
  socialLinks: {
    instagram: "https://instagram.com/reikigoddess",
  },
};

/**
 * Mock Blog Posts Collection
 *
 * Comprehensive collection of 8 blog posts covering various categories:
 * - Healing: Energy healing, Reiki fundamentals
 * - Wellness: Stress relief, self-care practices
 * - Meditation: Guided meditations, mindfulness
 * - Chakras: Energy centers, balancing techniques
 * - Guides: How-to content, educational resources
 * - Stories: Personal journeys and transformations
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Reiki Energy Healing",
    slug: "understanding-reiki-energy-healing",
    excerpt:
      "Discover how Reiki energy can transform your wellness journey through gentle healing touch and universal life force energy.",
    content:
      '# Understanding Reiki Energy Healing\n\nReiki is a Japanese healing technique that channels universal life force energy through the practitioner\'s hands to promote healing, relaxation, and balance. In this comprehensive guide, we\'ll explore the fundamentals of Reiki and how it can support your physical, emotional, and spiritual well-being.\n\n## What is Reiki?\n\nReiki (pronounced "ray-key") combines two Japanese words: "rei" meaning universal, and "ki" meaning life force energy. This gentle, non-invasive healing practice has been used for over a century to promote wellness and deep relaxation.\n\n## Benefits of Reiki\n\n- Reduces stress and promotes deep relaxation\n- Supports the body\'s natural healing processes\n- Balances energy centers (chakras)\n- Releases emotional blockages\n- Enhances overall well-being\n\n## What to Expect in a Session\n\nDuring a Reiki session, you\'ll lie fully clothed on a comfortable massage table while the practitioner places their hands lightly on or just above your body. Most people experience a deep sense of peace and relaxation, and many report feeling warmth, tingling, or gentle pulsations of energy.',
    category: "healing",
    author: mockAuthor,
    publishDate: "2025-10-01T10:00:00Z",
    readTime: "5 min read",
    featuredImage:
      "/img/blog/posts/Understanding%20Reiki%20Energy%20Healing.png",
    tags: ["reiki", "energy healing", "wellness"],
    featured: true,
  },
  {
    id: "2",
    title: "Understanding Your Seven Chakras",
    slug: "understanding-seven-chakras",
    excerpt:
      "A comprehensive guide to the seven main chakras and how to balance your body's energy centers for optimal health.",
    content:
      "# Understanding Your Seven Chakras\n\nThe chakra system is an ancient map of the body's energy centers. Learn how these seven spinning wheels of energy influence your physical, emotional, and spiritual well-being.\n\n## The Seven Main Chakras\n\n1. **Root Chakra** (Muladhara) - Grounding and security\n2. **Sacral Chakra** (Svadhisthana) - Creativity and emotions\n3. **Solar Plexus Chakra** (Manipura) - Personal power\n4. **Heart Chakra** (Anahata) - Love and compassion\n5. **Throat Chakra** (Vishuddha) - Communication and truth\n6. **Third Eye Chakra** (Ajna) - Intuition and insight\n7. **Crown Chakra** (Sahasrara) - Spiritual connection\n\n## Balancing Your Chakras\n\nWhen your chakras are balanced and aligned, energy flows freely through your body, supporting overall health and vitality. Reiki is an excellent way to clear blockages and restore balance to your chakra system.",
    category: "chakras",
    author: "Deirdre, The Reiki Goddess",
    publishDate: "2025-09-28T09:00:00Z",
    readTime: "7 min read",
    featuredImage: "/img/blog/posts/Understanding%20Your%207%20Chakras.png",
    tags: ["chakras", "energy centers", "meditation"],
    featured: false,
  },
  {
    id: "3",
    title: "The Power of Sound Healing",
    slug: "power-of-sound-healing",
    excerpt:
      "Explore how vibrational sound therapy using singing bowls and tuning forks can restore harmony to your body and mind.",
    content:
      "# The Power of Sound Healing\n\nSound healing is an ancient practice that uses vibrations from instruments like singing bowls, tuning forks, and gongs to restore harmony and balance to the body's energy field.\n\n## How Sound Healing Works\n\nEverything in the universe vibrates at specific frequencies. When our bodies are out of balance, sound healing can help restore us to our natural harmonic state through resonance and entrainment.\n\n## Benefits of Sound Therapy\n\n- Deep relaxation and stress relief\n- Improved sleep quality\n- Enhanced mental clarity\n- Emotional release and healing\n- Pain reduction\n- Balanced energy flow\n\n## Types of Sound Healing Instruments\n\n- **Crystal Singing Bowls**: Create pure tones that resonate with chakras\n- **Tibetan Singing Bowls**: Produce rich, complex harmonics\n- **Tuning Forks**: Deliver precise vibrational frequencies\n- **Gongs**: Create powerful sound baths for deep transformation",
    category: "wellness",
    author: mockAuthor,
    publishDate: "2025-09-25T14:00:00Z",
    readTime: "6 min read",
    featuredImage: "/img/blog/posts/The%20Power%20of%20Sound%20Healing.png",
    tags: ["sound healing", "wellness", "vibration therapy"],
    featured: false,
  },
  {
    id: "4",
    title: "Guided Meditation for Beginners",
    slug: "guided-meditation-beginners",
    excerpt:
      "Start your meditation practice with this simple, accessible guide designed for complete beginners.",
    content:
      "# Guided Meditation for Beginners\n\nMeditation is a powerful tool for reducing stress, enhancing self-awareness, and cultivating inner peace. This beginner-friendly guide will help you start your meditation journey.\n\n## Getting Started\n\n1. **Find a Quiet Space**: Choose a comfortable, distraction-free area\n2. **Set a Timer**: Start with just 5-10 minutes\n3. **Get Comfortable**: Sit or lie down in a relaxed position\n4. **Focus on Your Breath**: Notice the natural rhythm of your breathing\n5. **Be Kind to Yourself**: It's normal for your mind to wander\n\n## Simple Breathing Meditation\n\n- Inhale slowly through your nose for a count of 4\n- Hold your breath for a count of 4\n- Exhale slowly through your mouth for a count of 6\n- Repeat for 5-10 minutes\n\n## Tips for Success\n\n- Practice at the same time each day\n- Start small and gradually increase duration\n- Don't judge yourself - there's no \"wrong\" way to meditate\n- Be patient - the benefits develop over time",
    category: "meditation",
    author: mockAuthor,
    publishDate: "2025-09-20T11:00:00Z",
    readTime: "4 min read",
    featuredImage: "/img/blog/posts/Guided%20Meditation%20for%20Beginners.png",
    tags: ["meditation", "mindfulness", "beginners"],
    featured: false,
  },
  {
    id: "5",
    title: "Stress Relief Through Energy Healing",
    slug: "stress-relief-energy-healing",
    excerpt:
      "Learn how energy healing techniques can provide natural, effective relief from stress, anxiety, and overwhelm.",
    content:
      "# Stress Relief Through Energy Healing\n\nIn our fast-paced modern world, stress has become a constant companion for many. Energy healing offers a gentle, natural approach to releasing tension and restoring balance.\n\n## Understanding Stress and Energy\n\nStress creates energetic blockages in your body that can manifest as physical tension, emotional distress, and mental fog. Energy healing works to release these blockages and restore your natural flow.\n\n## Energy Healing Techniques for Stress Relief\n\n### Reiki for Relaxation\nReiki promotes deep relaxation by balancing your energy field and activating your body's natural healing response. Many people fall into a peaceful, meditative state during sessions.\n\n### Breathwork\nConscious breathing techniques help release tension and calm the nervous system. Try box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4.\n\n### Chakra Balancing\nWhen stress accumulates, it often affects specific chakras. Balancing these energy centers can restore emotional equilibrium.\n\n## Creating a Daily Practice\n\n- Morning meditation (5-10 minutes)\n- Mid-day breathing exercises\n- Evening Reiki self-treatment\n- Weekly professional energy healing session",
    category: "wellness",
    author: "Taylor Quigley",
    publishDate: "2025-09-18T15:30:00Z",
    readTime: "5 min read",
    featuredImage:
      "/img/blog/posts/Stress%20Relief%20Through%20Energy%20Healing.png",
    tags: ["stress relief", "wellness", "reiki", "anxiety"],
    featured: false,
  },
  {
    id: "6",
    title: "My Journey to Becoming a Reiki Master",
    slug: "journey-to-reiki-master",
    excerpt:
      "A personal story of transformation, healing, and discovering my calling as a Reiki practitioner and teacher.",
    content:
      "# My Journey to Becoming a Reiki Master\n\nFifteen years ago, I was searching for something more - a deeper connection to healing and purpose. Little did I know that a chance encounter with Reiki would transform my life completely.\n\n## The Beginning\n\nMy first Reiki session was nothing short of magical. As the practitioner's hands hovered over my body, I felt waves of warmth and tingling energy. Tears streamed down my face as years of held emotion released. I knew in that moment that I had found my path.\n\n## The Training\n\nI began my formal Reiki training, progressing through Levels 1, 2, and eventually Master/Teacher certification. Each level brought new insights, abilities, and responsibilities.\n\n## The Challenges\n\nThe path wasn't always easy. Learning to trust the energy, developing my intuition, and facing my own healing journey required courage and commitment.\n\n## Finding My Voice\n\nAs I grew in my practice, I discovered my unique gift: combining Reiki with sound healing. The synergy between these modalities creates profound transformations for my clients.\n\n## Gratitude\n\nToday, I'm honored to serve as The Reiki Goddess, sharing this beautiful healing art with others and witnessing their transformations.",
    category: "stories",
    author: mockAuthor,
    publishDate: "2025-09-15T09:00:00Z",
    readTime: "8 min read",
    featuredImage:
      "/img/blog/posts/My%20Journey%20to%20Becoming%20a%20Reiki%20Master.png",
    tags: ["personal story", "reiki", "transformation"],
    featured: false,
  },
  {
    id: "7",
    title: "How to Prepare for Your First Reiki Session",
    slug: "prepare-first-reiki-session",
    excerpt:
      "Essential tips and guidance to help you get the most from your first Reiki healing experience.",
    content:
      "# How to Prepare for Your First Reiki Session\n\nIf you're new to Reiki, you might be wondering what to expect and how to prepare. This guide will help you feel confident and ready for your first session.\n\n## Before Your Session\n\n### What to Wear\n- Comfortable, loose-fitting clothing\n- Remove jewelry if possible\n- Avoid heavy perfumes or scents\n\n### Hydration\n- Drink plenty of water before and after\n- Avoid heavy meals right before\n- Limit caffeine and alcohol\n\n### Mental Preparation\n- Come with an open mind\n- Set an intention for healing\n- Release expectations\n\n## During Your Session\n\n### What Happens\n1. Brief consultation with your practitioner\n2. You'll lie fully clothed on a massage table\n3. Practitioner places hands lightly on or above your body\n4. Session typically lasts 60-90 minutes\n5. You may experience warmth, tingling, or deep relaxation\n\n### What You Might Feel\n- Deep peace and relaxation\n- Warmth or coolness\n- Gentle energy movements\n- Emotional releases\n- Insights or visions\n\n## After Your Session\n\n- Drink plenty of water\n- Rest and allow integration\n- Journal any insights\n- Be gentle with yourself\n- Notice changes over the next few days",
    category: "guides",
    author: mockAuthor,
    publishDate: "2025-09-12T13:00:00Z",
    readTime: "6 min read",
    featuredImage:
      "/img/blog/posts/How%20to%20Prepare%20for%20Your%20First%20Reiki%20Session.jpeg",
    tags: ["reiki", "beginners", "preparation", "guides"],
    featured: false,
  },
  {
    id: "8",
    title: "The Science Behind Energy Healing",
    slug: "science-behind-energy-healing",
    excerpt:
      "Explore the scientific research and studies that support the effectiveness of energy healing modalities like Reiki.",
    content:
      "# The Science Behind Energy Healing\n\nWhile energy healing has ancient roots, modern science is beginning to validate what practitioners have known for centuries: energy medicine can create measurable changes in the body.\n\n## The Biofield\n\nResearchers have documented the existence of the biofield - an electromagnetic field that surrounds and permeates the human body. Energy healing works with this field to promote balance and wellness.\n\n## Research Findings\n\n### Stress Reduction\nMultiple studies show that Reiki significantly reduces stress hormones like cortisol while increasing feelings of relaxation and well-being.\n\n### Pain Management\nClinical trials demonstrate that energy healing can reduce both acute and chronic pain, often as effectively as conventional pain management techniques.\n\n### Immune Function\nResearch indicates that regular energy healing sessions may boost immune system function by reducing stress and promoting homeostasis.\n\n### Heart Health\nStudies show improvements in heart rate variability and blood pressure following energy healing sessions.\n\n## The Placebo Effect?\n\nSkeptics often attribute energy healing benefits to placebo effect. However, studies on animals and unconscious patients show benefits, suggesting mechanisms beyond belief.\n\n## Integration with Conventional Medicine\n\nMany hospitals now offer Reiki and other energy healing modalities as complementary therapies, recognizing their value in supporting patient care.",
    category: "guides",
    author: "Taylor Quigley",
    publishDate: "2025-09-08T10:30:00Z",
    readTime: "7 min read",
    featuredImage:
      "/img/blog/posts/The%20Science%20Behind%20Energy%20Healing.png",
    tags: ["research", "science", "reiki", "wellness"],
    featured: false,
  },
];
