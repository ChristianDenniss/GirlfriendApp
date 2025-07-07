"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const data_source_1 = require("../data-source");
const Module_1 = require("../entities/Module");
const Item_1 = require("../entities/Item");
const sampleModules = [
    {
        name: "Groceries",
        type: "groceries",
        description: "Shopping list for groceries",
        color: "#66BB6A",
        icon: "shopping-cart",
        items: [
            { title: "Milk", description: "2% organic milk", priority: 1, category: "Dairy" },
            { title: "Bread", description: "Whole wheat bread", priority: 2, category: "Bakery" },
            { title: "Bananas", description: "Organic bananas", priority: 1, category: "Fruits" },
            { title: "Chicken breast", description: "Free-range chicken", priority: 3, category: "Meat" },
            { title: "Rice", description: "Brown rice", priority: 2, category: "Grains" }
        ]
    },
    {
        name: "Todo",
        type: "todo",
        description: "Daily tasks and reminders",
        color: "#FF6B6B",
        icon: "check-square",
        items: [
            { title: "Call mom", description: "Check in with mom", priority: 1, category: "Personal" },
            { title: "Pay bills", description: "Pay electricity and water bills", priority: 3, category: "Finance" },
            { title: "Exercise", description: "30 minutes cardio", priority: 2, category: "Health" },
            { title: "Read book", description: "Read 20 pages of current book", priority: 1, category: "Personal" },
            { title: "Clean kitchen", description: "Wipe counters and wash dishes", priority: 2, category: "Home" }
        ]
    },
    {
        name: "Bucket List",
        type: "bucketlist",
        description: "Life goals and dreams",
        color: "#4ECDC4",
        icon: "star",
        items: [
            { title: "Visit Japan", description: "Experience Japanese culture and food", priority: 1, category: "Travel" },
            { title: "Learn to play guitar", description: "Master basic chords and songs", priority: 2, category: "Skills" },
            { title: "Run a marathon", description: "Complete a full 26.2 mile race", priority: 3, category: "Fitness" },
            { title: "Write a book", description: "Complete a novel or memoir", priority: 2, category: "Creative" },
            { title: "Learn to cook", description: "Master 10 signature dishes", priority: 1, category: "Skills" }
        ]
    }
];
async function seedDatabase() {
    try {
        await data_source_1.AppDataSource.initialize();
        // Clear existing data
        await data_source_1.AppDataSource.getRepository(Item_1.Item).clear();
        await data_source_1.AppDataSource.getRepository(Module_1.Module).clear();
        // Insert modules and their items
        for (const moduleData of sampleModules) {
            const module = new Module_1.Module();
            module.name = moduleData.name;
            module.type = moduleData.type;
            module.description = moduleData.description;
            module.color = moduleData.color;
            module.icon = moduleData.icon;
            module.itemCount = moduleData.items.length;
            const savedModule = await data_source_1.AppDataSource.getRepository(Module_1.Module).save(module);
            // Create items for this module
            for (const itemData of moduleData.items) {
                const item = new Item_1.Item();
                item.title = itemData.title;
                item.description = itemData.description;
                item.priority = itemData.priority;
                item.category = itemData.category;
                item.moduleId = savedModule.id;
                await data_source_1.AppDataSource.getRepository(Item_1.Item).save(item);
            }
        }
        console.log("Database seeded successfully!");
        await data_source_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error("Error seeding database:", error);
        await data_source_1.AppDataSource.destroy();
    }
}
// Run if called directly
if (require.main === module) {
    seedDatabase();
}
//# sourceMappingURL=sample-data.js.map