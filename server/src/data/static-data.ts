import type { Scenario } from "@thesis/types";
import type { TaskList } from "@thesis/types";

export const STATIC_SCENARIOS: Scenario[] = [
    {
        id: "warmup",
        title: "Meeting a New Classmate",
        aiDescription: "You are a friendly student who just started at a new language school. You are meeting this person for the first time. Greet them warmly, introduce yourself, and ask simple questions about them. Speak slowly and use very simple Spanish.",
        userDescription: "You are at a language school and meeting a new classmate for the first time. Introduce yourself, find out a bit about them, and say goodbye."
    },
    {
        id: "cafe",
        title: "Ordering at a Café",
        aiDescription: "You are a friendly waiter at a small café in Spain. Welcome the customer, offer them a table, take their order for food and drinks, tell them the prices when asked, and say goodbye when they leave. Be patient and speak slowly in simple Spanish.",
        userDescription: "You are visiting a café in Spain. Greet the waiter, order a drink and something to eat, ask about the price, and say goodbye when you leave."
    },
    {
        id: "market",
        title: "Shopping at the Market",
        aiDescription: "You are a friendly vendor at an outdoor fruit and vegetable market in Spain. Help the customer find what they need, tell them prices when asked, and assist with quantities. Be warm and patient, using very simple Spanish.",
        userDescription: "You are shopping at an outdoor market in Spain. Ask the vendor what they have, choose what you want to buy, ask about prices and quantities, and pay."
    }
];

const WARMUP_TASKS: TaskList = [
    {
        id: 1,
        description: "Greet your classmate and introduce yourself — say your name.",
        completed: false,
        hint: { text: "You can say '¡Hola! Me llamo...' and add your name.", used: false },
        solution: { text: "¡Hola! Me llamo Sofía. ¿Y tú?", used: false }
    },
    {
        id: 2,
        description: "Ask where your classmate is from and say where you are from.",
        completed: false,
        hint: { text: "Ask '¿De dónde eres?' and answer with 'Soy de...' followed by your country.", used: false },
        solution: { text: "¿De dónde eres? Yo soy de Alemania.", used: false }
    },
    {
        id: 3,
        description: "Say how old you are and ask their age.",
        completed: false,
        hint: { text: "Say 'Tengo ... años.' for your age and ask '¿Cuántos años tienes?'", used: false },
        solution: { text: "Tengo veinte años. ¿Cuántos años tienes tú?", used: false }
    },
    {
        id: 4,
        description: "Tell your classmate one thing you like and ask if they like it too.",
        completed: false,
        hint: { text: "Say 'Me gusta...' for something you like and ask '¿Te gusta...?' to them.", used: false },
        solution: { text: "Me gusta la música. ¿Y a ti? ¿Te gusta la música?", used: false }
    },
    {
        id: 5,
        description: "Say goodbye politely.",
        completed: false,
        hint: { text: "You can say '¡Hasta luego!' (see you later) or '¡Hasta pronto!' (see you soon).", used: false },
        solution: { text: "¡Fue un placer conocerte! ¡Hasta luego!", used: false }
    }
];

const CAFE_TASKS: TaskList = [
    {
        id: 1,
        description: "Greet the waiter and ask for a table.",
        completed: false,
        hint: { text: "Start with '¡Buenos días!' and ask for a table with 'Una mesa para uno, por favor.'", used: false },
        solution: { text: "¡Buenos días! Una mesa para uno, por favor.", used: false }
    },
    {
        id: 2,
        description: "Ask what drinks are available.",
        completed: false,
        hint: { text: "You can ask '¿Qué bebidas tienen?' — it means 'What drinks do you have?'", used: false },
        solution: { text: "Perdón, ¿qué bebidas tienen?", used: false }
    },
    {
        id: 3,
        description: "Order a drink.",
        completed: false,
        hint: { text: "Say 'Quiero un...' (I want a...) or 'Me pone un..., por favor' to place your order.", used: false },
        solution: { text: "Quiero un café con leche, por favor.", used: false }
    },
    {
        id: 4,
        description: "Ask what there is to eat and order something.",
        completed: false,
        hint: { text: "Ask '¿Qué hay para comer?' (What is there to eat?) then order with 'Quiero..., por favor.'", used: false },
        solution: { text: "¿Qué hay para comer? Quiero un bocadillo de jamón, por favor.", used: false }
    },
    {
        id: 5,
        description: "Ask how much your order costs.",
        completed: false,
        hint: { text: "Ask '¿Cuánto es en total?' — it means 'How much is it in total?'", used: false },
        solution: { text: "Perdón, ¿cuánto es en total?", used: false }
    },
    {
        id: 6,
        description: "Say whether the food or drink was good.",
        completed: false,
        hint: { text: "You can say 'Estaba muy rico.' — it means 'It was very tasty.'", used: false },
        solution: { text: "¡Estaba muy rico, gracias!", used: false }
    },
    {
        id: 7,
        description: "Ask for the bill and say goodbye.",
        completed: false,
        hint: { text: "Ask 'La cuenta, por favor.' for the bill, then say '¡Hasta luego!' to say goodbye.", used: false },
        solution: { text: "La cuenta, por favor. ¡Muchas gracias! ¡Hasta luego!", used: false }
    }
];

const MARKET_TASKS: TaskList = [
    {
        id: 1,
        description: "Greet the vendor.",
        completed: false,
        hint: { text: "Say '¡Buenos días!' (Good morning) or '¡Hola! ¿Qué tal?' (Hi! How are you?)", used: false },
        solution: { text: "¡Buenos días! ¿Qué tal?", used: false }
    },
    {
        id: 2,
        description: "Ask what fruits and vegetables they have today.",
        completed: false,
        hint: { text: "Ask '¿Qué frutas y verduras tiene hoy?' — 'What fruits and vegetables do you have today?'", used: false },
        solution: { text: "¿Qué frutas y verduras tiene hoy?", used: false }
    },
    {
        id: 3,
        description: "Say what you would like to buy.",
        completed: false,
        hint: { text: "Use 'Quiero...' (I want...) followed by the name of a fruit or vegetable.", used: false },
        solution: { text: "Quiero manzanas y tomates, por favor.", used: false }
    },
    {
        id: 4,
        description: "Ask the price of one of the items.",
        completed: false,
        hint: { text: "Ask '¿Cuánto cuestan las...?' — 'How much do the ... cost?'", used: false },
        solution: { text: "¿Cuánto cuestan las manzanas?", used: false }
    },
    {
        id: 5,
        description: "Say how much of each item you want.",
        completed: false,
        hint: { text: "Use 'Un kilo de...' (one kilo of) or 'Dos kilos de...' (two kilos of).", used: false },
        solution: { text: "Un kilo de manzanas y medio kilo de tomates, por favor.", used: false }
    },
    {
        id: 6,
        description: "Ask if the vendor has a specific item you would like.",
        completed: false,
        hint: { text: "Ask '¿Tiene...?' — it means 'Do you have...?' — then name the item.", used: false },
        solution: { text: "¿Tiene fresas? Me gustan mucho las fresas.", used: false }
    },
    {
        id: 7,
        description: "Pay and say goodbye.",
        completed: false,
        hint: { text: "Say 'Aquí tiene.' when handing over money, then '¡Muchas gracias! ¡Hasta luego!'", used: false },
        solution: { text: "Aquí tiene. ¡Muchas gracias! ¡Hasta luego!", used: false }
    }
];

export const STATIC_TASK_LISTS: Record<string, TaskList> = {
    warmup: WARMUP_TASKS,
    cafe: CAFE_TASKS,
    market: MARKET_TASKS
};
