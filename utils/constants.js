const therapist_traits = {
  Directiveness: {
    name: "Directiveness",
    description:
      "This dimension describes the extent to which the therapist guides the conversation and suggests strategies versus allowing the client to lead the discussion and discover their own solutions.",
    high: "Non-directive",
    low: "Directive",
  },
  Focus: {
    name: "Focus",
    description:
      " This spectrum indicates whether the therapist is more oriented towards helping the client find immediate, practical solutions or towards deeper, long-term understanding of the underlying issues.",
    high: "Process-focused",
    low: "Goal-focused",
  },
  Orientation: {
    name: "Orientation",
    description:
      "This dimension describes whether the therapist prioritizes setting and achieving specific goals (task-oriented), or focuses more on building a therapeutic relationship and fostering a safe, supportive environment (relationship-oriented).",
    high: "Relationship-oriented",
    low: "Task-oriented",
  },
  Structure: {
    name: "Structure",
    description:
      "This indicates the degree to which the therapist adheres to a particular therapeutic framework or is open to blending different methods and adapting to the client's unique needs.",
    high: "Flexible",
    low: "Structured",
  },
};

const therapists = [
  {
    name: "Dr. Harmony",
    tagline: "The Empathetic Healer",
    description:
      "Warm, kind, and understanding. Dr. Harmony is always ready to lend a patient ear, offering compassion and empathy to everyone she interacts with.  Primarily uses person-centered therapy, focused on providing a safe and supportive environment for clients to explore their feelings.",
    traits: {
      Directiveness: 3,
      Focus: 4,
      Orientation: 2,
      Structure: 5,
    },
  },
  {
    name: "Dr. Insight",
    tagline: "The Analytical Explorer",
    description:
      "Thoughtful, observant, and logical. Dr. Insight is deeply curious about the human mind and its complexities. Leverages cognitive-behavioral therapy, helping clients identify and challenge negative thought patterns to improve mental health.",
    traits: {
      Directiveness: 8,
      Focus: 6,
      Orientation: 7,
      Structure: 8,
    },
  },
  {
    name: "Dr. Clarity",
    tagline: "The Clear Communicator",
    description:
      "Direct, clear, and assertive. Dr. Clarity believes in communicating openly and honestly, helping clients understand and confront their issues head-on. Uses solution-focused brief therapy, emphasizing clear, concise, and direct communication to help clients find practical solutions to their problems.",
    traits: {
      Directiveness: 7,
      Focus: 9,
      Orientation: 8,
      Structure: 7,
    },
  },
  {
    name: "Dr. Flex",
    tagline: "The Adaptive Facilitator",
    description:
      "Open-minded, flexible, and adaptable. Dr. Flex is adept at adjusting his approach to fit the unique needs and circumstances of each client. Uses integrative therapy, blending elements from different therapeutic approaches to create a customized treatment plan for each client.",
    traits: {
      Directiveness: 5,
      Focus: 7,
      Orientation: 6,
      Structure: 2,
    },
  },
];

export { therapists, therapist_traits };
