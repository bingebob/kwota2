const config = {
    tiers: [
        {
            id: 'tier1',
            title: 'Rare',
            description: 'Designed for game developers seeking high-quality trailers at the best value possible. With our Rare Package we use game capture footage provided by you. We will cut together a bespoke, high-quality edit to showcase your game and get your audience excited.',
            price: 7500,
            inclusions: [
                'Delivery of a finished trailer of 30-90 seconds duration',
                'Three initial concepts to select from',
                'We provide a shot list to direct your self-capture',
                'Includes some moodboards and styleframes for slates',
                'Up to two edit iterations using your capture footage',
                'Motion graphics plus one round of amends',
                'Animated endslate using key art provided by you',
                'Final edit including audio',
            ]
        },
        {
            id: 'tier2',
            title: 'Epic',
            description: 'Our standard post production package, including game capture by the TrailerFarm team. Perfect for developers who want professional game capture and a polished trailer.',
            price: 10000,
            inclusions: [
                'Everything in the Rare package',
                'Professional game capture by our team',
                'Four initial concepts to select from',
                'Up to three edit iterations',
                'Advanced motion graphics with two rounds of amends',
                'Custom sound design and audio mix',
                'Project management and creative direction',
                'Delivery in multiple formats and lengths'
            ]
        },
        {
            id: 'tier3',
            title: 'Legendary',
            description: 'Premium package with enhanced creative direction, multiple deliverables, and comprehensive marketing support.',
            price: 15000,
            inclusions: [
                'Everything in the Epic package',
                'Six initial concepts to select from',
                'Unlimited edit iterations',
                'Premium motion graphics package',
                'Custom music composition',
                'Social media cutdowns',
                'Marketing consultation',
                'Priority support and faster delivery'
            ]
        },
        {
            id: 'tier4',
            title: 'Mythic',
            description: 'The ultimate trailer package with full creative control, extensive marketing assets, and white-glove service.',
            price: 20000,
            inclusions: [
                'Everything in the Legendary package',
                'Full creative control and direction',
                'Multiple trailer versions',
                'Complete marketing asset package',
                'Cinematic enhancement features',
                'Global market optimization',
                'Dedicated project manager',
                '24/7 support access'
            ]
        }
    ],
    
    formQuestions: [
        {
            id: 'question1',
            type: 'slider',
            label: 'This tier requires you to provide your own game capture, would you like us to provide a number of remote directed capture sessions',
            min: 1,
            max: 100,
            default: 10,
            availableForTiers: ['tier1']
        },
        {
            id: 'question2',
            type: 'toggle',
            label: 'Add Voice Over Package',
            description: 'From casting to directing, we can help you find the perfect voice for your trailer',
            price: 1000,
            default: false,
            availableForTiers: ['tier2', 'tier3', 'tier4'],
            subQuestions: [
                {
                    id: 'question2_1',
                    type: 'select',
                    label: 'Voice Actor Gender',
                    options: ['Male', 'Female', 'No Preference'],
                    default: 'No Preference'
                },
                {
                    id: 'question2_2',
                    type: 'select',
                    label: 'Voice Actor Age Range',
                    options: ['Young Adult (20-30)', 'Adult (30-50)', 'Mature (50+)', 'No Preference'],
                    default: 'No Preference'
                }
            ]
        },
        {
            id: 'question3',
            type: 'select',
            label: 'Music Package',
            description: 'Select your preferred music option',
            options: ['Use Your Music (Free)', 'Library Music ($575)', 'Premium Sync Music ($1000+)'],
            default: 'Use Your Music (Free)',
            availableForTiers: ['tier2', 'tier3', 'tier4']
        },
        {
            id: 'question4',
            type: 'slider',
            label: 'Additional Sound Design Passes',
            description: 'Each pass costs $150 per 30 seconds',
            min: 0,
            max: 5,
            default: 0,
            price: 150,
            availableForTiers: ['tier2', 'tier3', 'tier4']
        },
        {
            id: 'question5',
            type: 'toggle',
            label: 'Additional Versions',
            default: false,
            availableForTiers: ['tier2', 'tier3', 'tier4'],
            subQuestions: [
                {
                    id: 'question5_1',
                    type: 'toggle',
                    label: 'Additional Aspect Ratios',
                    options: ['Portrait (9:16)', 'Square (1:1)'],
                    price: 250,
                    default: false
                },
                {
                    id: 'question5_2',
                    type: 'toggle',
                    label: 'Additional Languages',
                    options: ['French', 'Italian', 'German', 'Spanish'],
                    price: 200,
                    default: false
                },
                {
                    id: 'question5_3',
                    type: 'toggle',
                    label: 'Additional Durations',
                    options: ['30s', '15s', '6s'],
                    price: 150,
                    default: false
                }
            ]
        },
        {
            id: 'question6',
            type: 'toggle',
            label: 'Purchase Source Files',
            description: 'Edit Timeline and Motion Graphics Templates (20% of project cost)',
            default: false,
            availableForTiers: ['tier1', 'tier2', 'tier3', 'tier4']
        }
    ]
}; 