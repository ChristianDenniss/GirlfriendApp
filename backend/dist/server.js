"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./src/data-source");
const Module_1 = require("./src/entities/Module");
const Item_1 = require("./src/entities/Item");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize TypeORM
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Maddy App Backend running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Maddy App Backend is running!' });
});
// Get all modules with their items
app.get('/api/modules', async (req, res) => {
    try {
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const modules = await moduleRepository.find({
            relations: ['items'],
            order: { createdAt: 'ASC' }
        });
        res.json(modules);
    }
    catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});
// Get a single module with its items
app.get('/api/modules/:id', async (req, res) => {
    try {
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const module = await moduleRepository.findOne({
            where: { id: req.params.id },
            relations: ['items']
        });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }
        res.json(module);
    }
    catch (error) {
        console.error('Error fetching module:', error);
        res.status(500).json({ error: 'Failed to fetch module' });
    }
});
// Create a new module
app.post('/api/modules', async (req, res) => {
    try {
        const { name, type, description, color, icon } = req.body;
        if (!name || !type) {
            return res.status(400).json({ error: 'Name and type are required' });
        }
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const newModule = new Module_1.Module();
        newModule.name = name;
        newModule.type = type;
        newModule.description = description || '';
        newModule.color = color || '#66BB6A';
        newModule.icon = icon || null;
        newModule.itemCount = 0;
        const savedModule = await moduleRepository.save(newModule);
        res.status(201).json(savedModule);
    }
    catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ error: 'Failed to create module' });
    }
});
// Update a module
app.put('/api/modules/:id', async (req, res) => {
    try {
        const { name, type, description, color, icon } = req.body;
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const module = await moduleRepository.findOne({
            where: { id: req.params.id }
        });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }
        if (name)
            module.name = name;
        if (type)
            module.type = type;
        if (description !== undefined)
            module.description = description;
        if (color)
            module.color = color;
        if (icon !== undefined)
            module.icon = icon;
        const updatedModule = await moduleRepository.save(module);
        res.json(updatedModule);
    }
    catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ error: 'Failed to update module' });
    }
});
// Delete a module
app.delete('/api/modules/:id', async (req, res) => {
    try {
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const module = await moduleRepository.findOne({
            where: { id: req.params.id }
        });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }
        await moduleRepository.remove(module);
        res.json({ message: 'Module deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ error: 'Failed to delete module' });
    }
});
// Get all items for a module
app.get('/api/modules/:moduleId/items', async (req, res) => {
    try {
        const itemRepository = data_source_1.AppDataSource.getRepository(Item_1.Item);
        const items = await itemRepository.find({
            where: { moduleId: req.params.moduleId },
            order: { priority: 'DESC', createdAt: 'ASC' }
        });
        res.json(items);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});
// Create a new item
app.post('/api/modules/:moduleId/items', async (req, res) => {
    try {
        const { title, description, priority, category, dueDate } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const module = await moduleRepository.findOne({
            where: { id: req.params.moduleId }
        });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }
        const itemRepository = data_source_1.AppDataSource.getRepository(Item_1.Item);
        const newItem = new Item_1.Item();
        newItem.title = title;
        newItem.description = description || '';
        newItem.priority = priority || 0;
        newItem.category = category || null;
        newItem.dueDate = dueDate ? new Date(dueDate) : null;
        newItem.moduleId = req.params.moduleId;
        const savedItem = await itemRepository.save(newItem);
        // Update module item count
        module.itemCount += 1;
        await moduleRepository.save(module);
        res.status(201).json(savedItem);
    }
    catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});
// Update an item
app.put('/api/items/:id', async (req, res) => {
    try {
        const { title, description, completed, priority, category, dueDate } = req.body;
        const itemRepository = data_source_1.AppDataSource.getRepository(Item_1.Item);
        const item = await itemRepository.findOne({
            where: { id: req.params.id }
        });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (title !== undefined)
            item.title = title;
        if (description !== undefined)
            item.description = description;
        if (completed !== undefined)
            item.completed = completed;
        if (priority !== undefined)
            item.priority = priority;
        if (category !== undefined)
            item.category = category;
        if (dueDate !== undefined)
            item.dueDate = dueDate ? new Date(dueDate) : null;
        const updatedItem = await itemRepository.save(item);
        res.json(updatedItem);
    }
    catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});
// Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const itemRepository = data_source_1.AppDataSource.getRepository(Item_1.Item);
        const item = await itemRepository.findOne({
            where: { id: req.params.id }
        });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const moduleId = item.moduleId;
        await itemRepository.remove(item);
        // Update module item count
        const moduleRepository = data_source_1.AppDataSource.getRepository(Module_1.Module);
        const module = await moduleRepository.findOne({
            where: { id: moduleId }
        });
        if (module) {
            module.itemCount = Math.max(0, module.itemCount - 1);
            await moduleRepository.save(module);
        }
        res.json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map