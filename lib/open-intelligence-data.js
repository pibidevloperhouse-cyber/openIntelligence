export const generateHomepageData = () => {
  const authors = ["Steef-Jan Wiggers", "Daniel Curtis", "Ben Linders", "Matt Saunders", "Renato Losio", "Artenisa Chatziou", "Almir Vuk", "Eran Stiller", "Sara Bergman", "Leela Kumili", "Michael Redlich", "Bruno Couriol"];
  
  const getRandAuthor = (offset) => authors[offset % authors.length].toUpperCase();
  const getRandDate = (offset) => {
    const d = new Date(2026, 7, 28 - (offset * 1));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const presentationImages = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
  ];

  const guideCovers = [
    "https://images.unsplash.com/photo-1620825937374-87fc7d6aaf8e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=400&q=80"
  ];

  const topicsArray = [
    { title: 'Data Science', link: 'data-science', items: ['Data Engineering', 'Large Language Models', 'Causal Inference', 'Vector Databases'] },
    { title: 'Computer Vision', link: 'computer-vision', items: ['Object Detection', 'Vision-Language Models', 'Industrial Inspection', 'Vision Transformers'] },
    { title: 'Hardware with Edge AI (IoT)', link: 'hardware-with-edge-ai', items: ['LLMs on Edge', 'Quantization', 'NPU Architectures', 'TinyML'] },
    { title: 'Production-Ready Systems', link: 'production-ready-systems', items: ['Scalable RAG', 'MLOps CI/CD', 'Model Drift Detection', 'Serverless Inference'] },
    { title: 'Hybrid Infrastructure Mastery', link: 'hybrid-infrastructure-mastery', items: ['Hybrid Cloud AI', 'Kubernetes GPU Scheduling', 'Federated Learning', 'Data Gravity'] }
  ];

  return {
    news: [
      { title: "Microsoft Moves AI Governance From Policy to Runtime Enforcement", author: getRandAuthor(0), date: getRandDate(0) },
      { title: "Cloudflare OS: Cloudflare's Open-Source Corporate AI Platform Built on a Capability-Based Model", author: getRandAuthor(1), date: getRandDate(1) },
      { title: "OVHcloud Raises Prices as AI Memory Demand Reprices Non-AI Infrastructure", author: getRandAuthor(2), date: getRandDate(2) },
      { title: "JDK 27 and JDK 28: What We Know So Far", author: getRandAuthor(3), date: getRandDate(3) },
      { title: "Google's HEIR Aims to Make Homomorphic-Encrypted Inference a One-Click Capability", author: getRandAuthor(4), date: getRandDate(4) },
      { title: "DRAM Controller Register Manipulation Breaks CPU Memory Isolation", author: getRandAuthor(5), date: getRandDate(5) }
    ],
    trending: {
      '7 days': [
        "Cloudflare Announces Kitesurf, a Browser Engine for Agents",
        "Netflix Open-Sources Agentic Workflow for Causal Inference",
        ".NET 11 Preview 7 Brings Updates across C#, ASP.NET Core",
        "Cloudflare Cuts Astro GitHub Issues by 85% with AI Agents",
        "Cloudflare Turns Engineering Standards into an AI-Enforced System",
        "The Human Edge: Why Brownfield Codebases Need Mob Programming"
      ],
      '1 month': [
        "State of Play: AI Coding Assistants in Modern Enterprise",
        "How PGSimCity Turns PostgreSQL Complexity into a 3D Simulation",
        "Scaling Kubernetes for LLM Deployments: A Practical Guide",
        "Agentic Fitness Functions: Evolutionary Architecture",
        "InfoQ Cloud and DevOps Trends Report - 2026",
        "Comprehension as an Architectural Characteristic"
      ],
      '3 months': [
        "Vector Databases Compared: Qdrant, Milvus, and Pinecone",
        "The Real Cost of Running Local LLMs on Edge Devices",
        "Building High-Availability RAG Systems with LangChain",
        "Why WebAssembly is the Future of Edge Computing",
        "DRAM Controller Register Manipulation Breaks Isolation",
        "Directing a Swarm of Agents for Fun and Profit"
      ]
    },
    articles: [
      { title: "Rightsizing Platform Engineering: Building the Platform Your Organization Actually Needs", author: getRandAuthor(6), date: getRandDate(6), image: presentationImages[0] },
      { title: "Agentic Fitness Functions: Extending Evolutionary Architecture Beyond Deterministic Rules", author: getRandAuthor(7), date: getRandDate(7), image: presentationImages[1] },
      { title: "InfoQ Cloud and DevOps Trends Report - 2026", author: getRandAuthor(8), date: getRandDate(8), image: presentationImages[2] },
      { title: "Comprehension as an Architectural Characteristic: A System That Is Not Understood Cannot Evolve Safely", author: getRandAuthor(9), date: getRandDate(9), image: presentationImages[3] }
    ],
    missedIt: [
      { title: "Directing a Swarm of Agents for Fun and Profit", author: "ADRIAN COCKCROFT", image: presentationImages[0] },
      { title: "State of Play: AI Coding Assistants", author: "BIRGITTA BÖCKELER", image: presentationImages[1] },
      { title: "Duolingo's Kubernetes Leap", author: "FRANKA PASSING", image: presentationImages[2] },
      { title: "Engineering at AI Speed: Lessons from the First Agentically Accelerated Software Project", author: "ADAM WOLFF", image: presentationImages[3] },
      { title: "Million PDFs: Building a Modern Document Infrastructure with Rust and Typst", author: "ERIK STEIGER", image: presentationImages[4] }
    ],
    presentations: [
      { title: "Prompt to Prod: Engineering an Autonomous SDLC at Scale", author: "ANDREW SWERDLOW", date: getRandDate(10), image: presentationImages[0], duration: "48:20" },
      { title: "SafeChat: Building AI-Powered Safety Systems at Scale in a Real-Time Marketplace", author: "BRUNA PEREIRA", date: getRandDate(11), image: presentationImages[1], duration: "42:22" }
    ],
    podcasts: [
      { title: "The Human Edge: Why Brownfield Codebases Need Mob Programming, Not Just AI Vibes", author: "ASGAUT MJØLNE SØDERBOM", date: getRandDate(12), image: presentationImages[2], duration: "39:53" },
      { title: "Will Agentic AI Bring Fantasia's Sorcerer's Apprentice to Life?: A Conversation with Tracy", author: "TRACY BANNON", date: getRandDate(13), image: presentationImages[3], duration: "49:46" }
    ],
    guides: [
      { title: "Architecture as a Socio-Technical Craft", author: "INFOQ", image: guideCovers[0] },
      { title: "Agentic AI Architecture", author: "INFOQ", image: guideCovers[1] }
    ],
    topicColumns: topicsArray
  };
};

export const generateDataScienceData = () => {
  const getRandAuthor = (offset) => ["Yann LeCun", "Andrew Ng", "Geoffrey Hinton", "Fei-Fei Li", "Andrej Karpathy", "Ilya Sutskever"][offset % 6].toUpperCase();
  const getRandDate = (offset) => {
    const d = new Date(2026, 7, 28 - (offset * 2));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const presentationImages = [
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=600&q=80"
  ];

  const guideCovers = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=400&q=80"
  ];

  return {
    news: [
      { category: "AI, ML & DATA ENGINEERING", title: "OpenAI Announces GPT-5 Architectures Focused on Data Reasoning", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "DATA SCIENCE", title: "Pandas 3.0 Released: Huge Performance Gains with Arrow Backend", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "AI, ML & DATA ENGINEERING", title: "Meta Open-Sources Llama 4 for Edge Devices and IoT", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "DATA ENGINEERING", title: "Databricks Unveils Unified Processing Engine for Vector Data", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "DATA SCIENCE", title: "Why Python's GIL Removal is a Game Changer for ML Training", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "AI, ML & DATA ENGINEERING", title: "Hugging Face Crosses 5 Million Hosted Models Milestone", author: getRandAuthor(5), date: getRandDate(5) }
    ],
    presentations: [
      { category: "DATA SCIENCE", title: "Building RAG Pipelines that Don't Hallucinate", author: "ANDREJ KARPATHY", date: getRandDate(10), image: presentationImages[0], duration: "45:12" },
      { category: "AI, ML & DATA ENGINEERING", title: "The Future of Vector Search in Enterprise Architecture", author: "HARRISON CHASE", date: getRandDate(11), image: presentationImages[1], duration: "38:40" },
      { category: "DATA ENGINEERING", title: "Scaling Spark Clusters for Billion-Parameter Inference", author: "MATEI ZAHARIA", date: getRandDate(12), image: presentationImages[2], duration: "52:15" },
      { category: "DATA SCIENCE", title: "Federated Learning: Training AI without Seeing the Data", author: "FEI-FEI LI", date: getRandDate(13), image: presentationImages[3], duration: "41:05" },
      { category: "DATA ENGINEERING", title: "Real-time Stream Processing with Kafka and Flink for ML", author: "JAY KREPS", date: getRandDate(14), image: presentationImages[4], duration: "49:22" },
      { category: "AI, ML & DATA ENGINEERING", title: "Optimizing GPU Memory for Large Language Models", author: "JENSEN HUANG", date: getRandDate(15), image: presentationImages[5], duration: "55:30" }
    ],
    guides: [
      { category: "DATA SCIENCE", title: "The Data Science Trends Report 2026", author: "INFOQ", image: guideCovers[0] },
      { category: "AI, ML & DATA ENGINEERING", title: "Enterprise RAG Architectures", author: "INFOQ", image: guideCovers[1] },
      { category: "DATA ENGINEERING", title: "Streaming Data Pipelines in Production", author: "INFOQ", image: guideCovers[2] },
      { category: "DATA SCIENCE", title: "Advanced ML Model Monitoring", author: "INFOQ", image: guideCovers[3] }
    ],
    articles: [
      { category: "DATA SCIENCE", title: "Causal Inference in Machine Learning: Moving Beyond Correlation", author: getRandAuthor(6), date: getRandDate(6), image: presentationImages[2] },
      { category: "AI, ML & DATA ENGINEERING", title: "Vector Databases Compared: Qdrant, Milvus, and Pinecone", author: getRandAuthor(7), date: getRandDate(7), image: presentationImages[3] },
      { category: "DATA ENGINEERING", title: "Building a Semantic Layer for Your Data Warehouse", author: getRandAuthor(8), date: getRandDate(8), image: presentationImages[4] },
      { category: "DATA SCIENCE", title: "Understanding the Mathematics Behind Transformer Architectures", author: getRandAuthor(9), date: getRandDate(9), image: presentationImages[5] }
    ],
    podcasts: [
      { category: "DATA SCIENCE", title: "Data Science on the Edge: The Future of TinyML", author: "PETE WARDEN", date: getRandDate(10), image: presentationImages[1], duration: "34:47" },
      { category: "AI, ML & DATA ENGINEERING", title: "From Notebook to Production: Managing ML Lifecycles", author: "MATEI ZAHARIA", date: getRandDate(11), image: presentationImages[2], duration: "41:23" },
      { category: "DATA ENGINEERING", title: "Real-time Analytics with ClickHouse and Kafka", author: "ALEXEY MILOVIDOV", date: getRandDate(12), image: presentationImages[0], duration: "41:23" }
    ],
    topicColumns: [
      { title: 'DATA SCIENCE', items: ['Causal Inference in ML', 'Pandas 3.0 Performance', 'Time Series Forecasting', 'Math Behind Transformers'] },
      { title: 'AI, ML & DATA ENGINEERING', items: ['Vector Databases Compared', 'Meta Llama 4 on Edge', 'RAG Architectures', 'LLM Memory Optimization'] },
      { title: 'DATA ENGINEERING', items: ['Unified Processing for Vector Data', 'Semantic Layer in Warehouse', 'Streaming Data Pipelines', 'Scaling Spark Clusters'] },
      { title: 'PRODUCTION-READY SYSTEMS', items: ['MLOps CI/CD Pipelines', 'Model Drift Detection', 'High Availability Inference', 'Serverless ML Endpoints'] },
      { title: 'COMPUTER VISION', items: ['Vision Transformers (ViT)', 'Object Detection at Scale', 'Vision-Language Models', 'Edge AI for Vision'] }
    ]
  };
};

export const generateTopicData = (topicSlug) => {
  const getRandAuthor = (offset) => ["Fei-Fei Li", "Andrew Ng", "Yann LeCun", "Ilya Sutskever", "Andrej Karpathy", "Geoffrey Hinton"][offset % 6].toUpperCase();
  const getRandDate = (offset) => {
    const d = new Date(2026, 7, 28 - (offset * 2));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const presentationImages = [
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=600&q=80"
  ];

  const guideCovers = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=400&q=80"
  ];

  // Specific Titles and Content per Topic
  let titleHTML, desc, news, presentations, guides, articles, podcasts;

  if (topicSlug === 'computer-vision') {
    titleHTML = <>Computer <span className="gradient-text">Vision</span></>;
    desc = "Explore the latest breakthroughs in vision transformers, multi-modal LLMs, and real-time object detection systems.";
    news = [
      { category: "COMPUTER VISION", title: "Meta Unveils Segment Anything 3.0: Zero-Shot Video Tracking", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "RESEARCH", title: "Vision Transformers Outperform CNNs in Low-Light Medical Imaging", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "AI ALGORITHMS", title: "New EfficientViT Architecture Drops Inference Cost by 40%", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "COMPUTER VISION", title: "Tesla Open-Sources Real-Time 3D Occupancy Networks", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "RESEARCH", title: "Why Multi-Modal Models are Replacing Specialized Vision Systems", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "AI ALGORITHMS", title: "OpenCV 5.0 Release Brings Native CUDA and NPU Support", author: getRandAuthor(5), date: getRandDate(5) }
    ];
  } else if (topicSlug === 'hardware-with-edge-ai') {
    titleHTML = <>Hardware & <span className="gradient-text">Edge AI</span></>;
    desc = "Dive into TinyML, NPU architectures, and techniques for running powerful AI models directly on edge devices.";
    news = [
      { category: "EDGE AI", title: "Apple M5 Chip Introduces dedicated Transformer Engine", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "HARDWARE", title: "Running Llama 3 8B Locally on Raspberry Pi 5 with Int4 Quantization", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "TINYML", title: "New MicroNPU Promises 10x Performance on Smartwatches", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "EDGE AI", title: "NVIDIA Unveils Jetson Thor for Advanced Autonomous Robots", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "HARDWARE", title: "The Rise of Neuromorphic Chips for Always-On Audio Detection", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "TINYML", title: "Google Open-Sources Edge TPU Compiler for Custom RISC-V Boards", author: getRandAuthor(5), date: getRandDate(5) }
    ];
  } else if (topicSlug === 'production-ready-systems') {
    titleHTML = <>Production-Ready <span className="gradient-text">Systems</span></>;
    desc = "Learn best practices for MLOps, scaling inference endpoints, and ensuring high availability in enterprise AI applications.";
    news = [
      { category: "MLOPS", title: "Scaling FastAPI and vLLM to Handle 100K Requests per Minute", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "SYSTEM DESIGN", title: "Detecting and Alerting on Model Drift in Real-Time Finance Applications", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "CI/CD", title: "GitOps for Machine Learning: Automating Model Deployments with ArgoCD", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "MLOPS", title: "Why Ray Serve is Becoming the Standard for AI Microservices", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "SYSTEM DESIGN", title: "Managing GPU Memory Fragmentation in Production LLM Clusters", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "CI/CD", title: "A/B Testing Large Language Models: Metrics that Actually Matter", author: getRandAuthor(5), date: getRandDate(5) }
    ];
  } else if (topicSlug === 'hybrid-infrastructure-mastery') {
    titleHTML = <>Hybrid Infrastructure <span className="gradient-text">Mastery</span></>;
    desc = "Master the art of combining on-premise GPU clusters with public cloud elasticity for optimal AI workloads.";
    news = [
      { category: "CLOUD AI", title: "AWS Announces Outposts for AI: Local GPUs, Cloud Management", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "INFRASTRUCTURE", title: "Scheduling Distributed Training Jobs Across On-Prem and Cloud with Kubernetes", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "CLOUD AI", title: "The Hidden Costs of Data Gravity in Multi-Cloud ML Training", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "NETWORKING", title: "RDMA over Converged Ethernet (RoCE) for Hybrid GPU Clusters", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "INFRASTRUCTURE", title: "OpenShift AI Introduces Seamless Cloud Bursting for Inference", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "NETWORKING", title: "Federated Learning: Aggregating Models Across Sovereign Data Centers", author: getRandAuthor(5), date: getRandDate(5) }
    ];
  } else {
    // Default fallback to Data Science if unknown
    titleHTML = <>Data Science & <span className="gradient-text">Machine Learning</span></>;
    desc = "Explore the latest advancements in LLMs, causal inference, and data engineering architectures shaping the future of AI.";
    news = [
      { category: "AI, ML & DATA ENGINEERING", title: "OpenAI Announces GPT-5 Architectures Focused on Data Reasoning", author: getRandAuthor(0), date: getRandDate(0) },
      { category: "DATA SCIENCE", title: "Pandas 3.0 Released: Huge Performance Gains with Arrow Backend", author: getRandAuthor(1), date: getRandDate(1) },
      { category: "AI, ML & DATA ENGINEERING", title: "Meta Open-Sources Llama 4 for Edge Devices and IoT", author: getRandAuthor(2), date: getRandDate(2) },
      { category: "DATA ENGINEERING", title: "Databricks Unveils Unified Processing Engine for Vector Data", author: getRandAuthor(3), date: getRandDate(3) },
      { category: "DATA SCIENCE", title: "Why Python's GIL Removal is a Game Changer for ML Training", author: getRandAuthor(4), date: getRandDate(4) },
      { category: "AI, ML & DATA ENGINEERING", title: "Hugging Face Crosses 5 Million Hosted Models Milestone", author: getRandAuthor(5), date: getRandDate(5) }
    ];
  }

  // Generic content for the rest of the sections, flavored slightly
  presentations = [
    { category: "KEYNOTE", title: `The Future of ${topicSlug.replace(/-/g, ' ').toUpperCase()}`, author: getRandAuthor(0), date: getRandDate(10), image: presentationImages[0], duration: "45:12" },
    { category: "TECHNICAL DEEP DIVE", title: "Optimizing Architectures for 2026", author: getRandAuthor(1), date: getRandDate(11), image: presentationImages[1], duration: "38:40" },
    { category: "CASE STUDY", title: "Scaling Systems at Enterprise Level", author: getRandAuthor(2), date: getRandDate(12), image: presentationImages[2], duration: "52:15" },
    { category: "PANEL", title: "Industry Leaders on What's Next", author: getRandAuthor(3), date: getRandDate(13), image: presentationImages[3], duration: "41:05" },
  ];

  guides = [
    { category: "E-BOOK", title: `Definitive Guide to ${topicSlug.replace(/-/g, ' ')}`, author: "INFOQ", image: guideCovers[0] },
    { category: "CHEAT SHEET", title: "Best Practices Architecture", author: "INFOQ", image: guideCovers[1] },
    { category: "REPORT", title: "2026 Trends & Analysis", author: "INFOQ", image: guideCovers[2] },
    { category: "WHITE PAPER", title: "Advanced Implementations", author: "INFOQ", image: guideCovers[3] }
  ];

  articles = [
    { category: "TUTORIAL", title: "Building a Semantic Layer for Your Systems", author: getRandAuthor(2), date: getRandDate(6), image: presentationImages[4] },
    { category: "ANALYSIS", title: "Understanding the Mathematics Behind The Tech", author: getRandAuthor(3), date: getRandDate(7), image: presentationImages[5] },
    { category: "OPINION", title: "Why We Need to Move Beyond Current Paradigms", author: getRandAuthor(4), date: getRandDate(8), image: presentationImages[2] },
  ];

  podcasts = [
    { category: "PODCAST", title: `Discussions on ${topicSlug.replace(/-/g, ' ')}`, author: getRandAuthor(5), date: getRandDate(10), image: presentationImages[1], duration: "34:47" },
    { category: "INTERVIEW", title: "From Notebook to Production", author: getRandAuthor(0), date: getRandDate(11), image: presentationImages[2], duration: "41:23" },
  ];

  return {
    titleHTML,
    desc,
    news,
    presentations,
    guides,
    articles,
    podcasts,
    topicColumns: [
      { title: 'DATA SCIENCE', link: 'data-science', items: ['Causal Inference in ML', 'Pandas 3.0 Performance', 'Time Series Forecasting', 'Math Behind Transformers'] },
      { title: 'AI, ML & DATA ENGINEERING', link: 'computer-vision', items: ['Vector Databases Compared', 'Meta Llama 4 on Edge', 'RAG Architectures', 'LLM Memory Optimization'] },
      { title: 'DATA ENGINEERING', link: 'hardware-with-edge-ai', items: ['Unified Processing for Vector Data', 'Semantic Layer in Warehouse', 'Streaming Data Pipelines', 'Scaling Spark Clusters'] },
      { title: 'PRODUCTION-READY SYSTEMS', link: 'production-ready-systems', items: ['MLOps CI/CD Pipelines', 'Model Drift Detection', 'High Availability Inference', 'Serverless ML Endpoints'] },
      { title: 'COMPUTER VISION', link: 'hybrid-infrastructure-mastery', items: ['Vision Transformers (ViT)', 'Object Detection at Scale', 'Vision-Language Models', 'Edge AI for Vision'] }
    ]
  };
};
