const Scenario = require('../models/Scenario');


const createScenario = async (req, res) => {
    try {
        const { name, selectedItems, foodMix, waterMix, energyMix } = req.body;
         console.log(req.body);
         
         if (!name || !selectedItems || !foodMix || !waterMix || !energyMix) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newScenario = new Scenario({
            name,
            selectedItems,
            foodMix,
            waterMix,
            energyMix
        });

        await newScenario.save();
        res.status(201).json({ message: "Scenario created successfully", scenario: newScenario });
    } catch (error) {
        console.log("error", error);
        
        res.status(500).json({ message: "Server error", error });
    }
};




const getScenarios = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;  
        limit = parseInt(limit) || 10; 

        const skip = (page - 1) * limit; 

        const totalScenarios = await Scenario.countDocuments();
        const scenarios = await Scenario.find().skip(skip).limit(limit);

        res.status(200).json({
            totalScenarios,
            currentPage: page,
            totalPages: Math.ceil(totalScenarios / limit),
            scenarios
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};






const updateScenario = async (req, res) => {
    try {
        console.log("Update Request Body:", req.body); 

        const scenario = await Scenario.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );

        if (!scenario) {
            return res.status(404).json({ message: "Scenario not found" });
        }

        console.log("Updated Scenario:", scenario); 

        res.status(200).json({ message: "Scenario updated successfully", scenario });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteScenario = async (req, res) => {
    try {
        const scenario = await Scenario.findByIdAndDelete(req.params.id);
        if (!scenario) return res.status(404).json({ message: "Scenario not found" });

        res.status(200).json({ message: "Scenario deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createScenario, getScenarios, updateScenario, deleteScenario };
