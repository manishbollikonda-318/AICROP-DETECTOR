import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

// ===================================================
// UNIVERSAL CROP DATABASE — 100+ crops worldwide
// ===================================================
const globalCrops = [
    // CEREALS & GRAINS
    { name: 'Rice', emoji: '🌾', category: 'Cereals', region: 'Asia, Africa', season: 'Kharif', soil: 'Alluvial, Clay', water: 'High', temp: '20-37°C', growDays: '120-150', uses: 'Food staple, flour, starch, brewing', marketPrice: '₹2,183/qtl', yieldRange: '25-40 qtl/acre' },
    { name: 'Wheat', emoji: '🌾', category: 'Cereals', region: 'Global', season: 'Rabi', soil: 'Loamy, Alluvial', water: 'Medium', temp: '10-25°C', growDays: '120-150', uses: 'Bread, pasta, flour, animal feed', marketPrice: '₹2,275/qtl', yieldRange: '18-25 qtl/acre' },
    { name: 'Maize (Corn)', emoji: '🌽', category: 'Cereals', region: 'Americas, Africa, Asia', season: 'Kharif', soil: 'Loamy, Sandy', water: 'Medium', temp: '21-27°C', growDays: '80-110', uses: 'Food, animal feed, ethanol, HFCS', marketPrice: '₹2,090/qtl', yieldRange: '25-40 qtl/acre' },
    { name: 'Barley', emoji: '🌾', category: 'Cereals', region: 'Europe, N. America', season: 'Rabi', soil: 'Loamy', water: 'Low-Medium', temp: '12-25°C', growDays: '90-120', uses: 'Beer brewing, animal feed, soups', marketPrice: '₹1,735/qtl', yieldRange: '15-20 qtl/acre' },
    { name: 'Sorghum (Jowar)', emoji: '🌿', category: 'Cereals', region: 'Africa, India', season: 'Kharif/Rabi', soil: 'Black, Clay', water: 'Low', temp: '25-35°C', growDays: '100-130', uses: 'Food, fodder, biofuel, syrup', marketPrice: '₹3,180/qtl', yieldRange: '10-15 qtl/acre' },
    { name: 'Millet (Bajra)', emoji: '🌿', category: 'Cereals', region: 'Africa, India', season: 'Kharif', soil: 'Sandy, Loamy', water: 'Very Low', temp: '25-35°C', growDays: '65-90', uses: 'Flour, porridge, brewing, fodder', marketPrice: '₹2,500/qtl', yieldRange: '8-12 qtl/acre' },
    { name: 'Oats', emoji: '🥣', category: 'Cereals', region: 'Europe, N. America', season: 'Rabi', soil: 'Loamy, Clay', water: 'Medium', temp: '15-25°C', growDays: '100-120', uses: 'Breakfast cereal, flour, animal feed', marketPrice: '₹3,500/qtl', yieldRange: '12-18 qtl/acre' },
    { name: 'Rye', emoji: '🌾', category: 'Cereals', region: 'Europe, Russia', season: 'Rabi', soil: 'Sandy, Loamy', water: 'Low', temp: '5-20°C', growDays: '120-150', uses: 'Bread, whiskey, animal feed', marketPrice: '₹2,800/qtl', yieldRange: '10-15 qtl/acre' },
    { name: 'Quinoa', emoji: '🥗', category: 'Cereals', region: 'S. America, Global', season: 'Rabi', soil: 'Sandy, Loamy', water: 'Low', temp: '15-25°C', growDays: '90-120', uses: 'Superfood, flour, salads', marketPrice: '₹12,000/qtl', yieldRange: '5-8 qtl/acre' },
    { name: 'Buckwheat', emoji: '🌿', category: 'Cereals', region: 'Asia, Europe', season: 'Kharif', soil: 'Loamy', water: 'Low', temp: '15-25°C', growDays: '70-90', uses: 'Noodles, pancakes, flour', marketPrice: '₹5,000/qtl', yieldRange: '5-10 qtl/acre' },

    // PULSES & LEGUMES
    { name: 'Chickpea (Chana)', emoji: '🫘', category: 'Pulses', region: 'India, Middle East', season: 'Rabi', soil: 'Loamy, Black', water: 'Low', temp: '15-30°C', growDays: '90-120', uses: 'Dal, hummus, flour, snacks', marketPrice: '₹5,440/qtl', yieldRange: '8-12 qtl/acre' },
    { name: 'Lentil (Masoor)', emoji: '🥣', category: 'Pulses', region: 'India, Canada', season: 'Rabi', soil: 'Loamy, Clay', water: 'Low', temp: '15-25°C', growDays: '100-130', uses: 'Dal, soups, salads', marketPrice: '₹6,425/qtl', yieldRange: '6-10 qtl/acre' },
    { name: 'Pigeon Pea (Tur)', emoji: '🫘', category: 'Pulses', region: 'India, Africa', season: 'Kharif', soil: 'Loamy, Red', water: 'Medium', temp: '20-35°C', growDays: '150-280', uses: 'Dal, pulse flour', marketPrice: '₹7,000/qtl', yieldRange: '5-8 qtl/acre' },
    { name: 'Soybean', emoji: '🫘', category: 'Pulses', region: 'Americas, Asia', season: 'Kharif', soil: 'Loamy, Black', water: 'Medium', temp: '20-30°C', growDays: '80-120', uses: 'Oil, tofu, soy milk, animal feed', marketPrice: '₹4,600/qtl', yieldRange: '10-15 qtl/acre' },
    { name: 'Groundnut (Peanut)', emoji: '🥜', category: 'Pulses', region: 'India, Africa, Americas', season: 'Kharif', soil: 'Sandy, Red', water: 'Medium', temp: '25-35°C', growDays: '100-140', uses: 'Oil, butter, snacks, cooking', marketPrice: '₹6,377/qtl', yieldRange: '10-15 qtl/acre' },
    { name: 'Black Gram (Urad)', emoji: '🫘', category: 'Pulses', region: 'India, SE Asia', season: 'Kharif', soil: 'Loamy, Black', water: 'Medium', temp: '25-35°C', growDays: '70-90', uses: 'Dal, vada, dosa batter', marketPrice: '₹6,950/qtl', yieldRange: '5-8 qtl/acre' },
    { name: 'Green Gram (Moong)', emoji: '🫘', category: 'Pulses', region: 'India, SE Asia', season: 'Kharif/Summer', soil: 'Sandy, Loamy', water: 'Low', temp: '25-35°C', growDays: '60-80', uses: 'Dal, sprouts, desserts', marketPrice: '₹8,558/qtl', yieldRange: '4-7 qtl/acre' },
    { name: 'Kidney Bean (Rajma)', emoji: '🫘', category: 'Pulses', region: 'Americas, India', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '15-25°C', growDays: '90-120', uses: 'Curries, salads, stews', marketPrice: '₹8,000/qtl', yieldRange: '6-10 qtl/acre' },

    // CASH CROPS
    { name: 'Cotton', emoji: '🏵️', category: 'Cash Crops', region: 'India, USA, China', season: 'Kharif', soil: 'Black, Alluvial', water: 'Medium', temp: '21-30°C', growDays: '150-180', uses: 'Textiles, seed oil, animal feed', marketPrice: '₹6,620/qtl', yieldRange: '6-10 qtl/acre' },
    { name: 'Sugarcane', emoji: '🍬', category: 'Cash Crops', region: 'Tropical worldwide', season: 'Year-round', soil: 'Loamy, Alluvial', water: 'Very High', temp: '20-35°C', growDays: '300-420', uses: 'Sugar, jaggery, ethanol, molasses', marketPrice: '₹315/qtl', yieldRange: '300-400 qtl/acre' },
    { name: 'Jute', emoji: '🧵', category: 'Cash Crops', region: 'India, Bangladesh', season: 'Kharif', soil: 'Alluvial', water: 'High', temp: '25-35°C', growDays: '100-120', uses: 'Burlap sacks, carpet backing, rope', marketPrice: '₹5,050/qtl', yieldRange: '8-12 qtl/acre' },
    { name: 'Tobacco', emoji: '🌿', category: 'Cash Crops', region: 'India, Americas', season: 'Kharif', soil: 'Sandy, Loamy', water: 'Medium', temp: '20-30°C', growDays: '90-120', uses: 'Cigarettes, chewing, insecticide', marketPrice: '₹6,500/qtl', yieldRange: '8-12 qtl/acre' },
    { name: 'Tea', emoji: '🍵', category: 'Cash Crops', region: 'India, China, Kenya', season: 'Year-round', soil: 'Acidic Loamy', water: 'High', temp: '20-30°C', growDays: 'Perennial', uses: 'Beverage, medicinal, cosmetics', marketPrice: '₹25,000/qtl', yieldRange: '6-8 qtl/acre/year' },
    { name: 'Coffee', emoji: '☕', category: 'Cash Crops', region: 'Brazil, India, Ethiopia', season: 'Year-round', soil: 'Volcanic, Loamy', water: 'Medium-High', temp: '15-28°C', growDays: 'Perennial', uses: 'Beverage, flavoring', marketPrice: '₹45,000/qtl', yieldRange: '3-5 qtl/acre/year' },
    { name: 'Rubber', emoji: '🌳', category: 'Cash Crops', region: 'SE Asia, Africa', season: 'Year-round', soil: 'Laterite', water: 'High', temp: '25-35°C', growDays: 'Perennial', uses: 'Tires, gloves, belts, footwear', marketPrice: '₹17,000/qtl', yieldRange: '4-6 qtl/acre/year' },
    { name: 'Coconut', emoji: '🥥', category: 'Cash Crops', region: 'Tropical coasts', season: 'Year-round', soil: 'Sandy, Laterite', water: 'Medium', temp: '25-35°C', growDays: 'Perennial', uses: 'Oil, milk, coir, copra', marketPrice: '₹3,200/qtl', yieldRange: '50-100 nuts/tree/year' },

    // OILSEEDS
    { name: 'Mustard', emoji: '🌼', category: 'Oilseeds', region: 'India, Canada', season: 'Rabi', soil: 'Sandy, Loamy', water: 'Low', temp: '10-25°C', growDays: '100-140', uses: 'Oil, condiment, greens', marketPrice: '₹5,650/qtl', yieldRange: '6-10 qtl/acre' },
    { name: 'Sunflower', emoji: '🌻', category: 'Oilseeds', region: 'Ukraine, India', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '20-30°C', growDays: '80-110', uses: 'Oil, seeds, bird feed', marketPrice: '₹6,400/qtl', yieldRange: '5-8 qtl/acre' },
    { name: 'Sesame (Til)', emoji: '🌱', category: 'Oilseeds', region: 'India, Africa', season: 'Kharif', soil: 'Sandy, Loamy', water: 'Low', temp: '25-35°C', growDays: '80-110', uses: 'Oil, tahini, sweets', marketPrice: '₹7,830/qtl', yieldRange: '3-5 qtl/acre' },
    { name: 'Flaxseed (Linseed)', emoji: '🌱', category: 'Oilseeds', region: 'Canada, India', season: 'Rabi', soil: 'Loamy', water: 'Low', temp: '15-25°C', growDays: '100-130', uses: 'Oil, fiber, health food', marketPrice: '₹7,000/qtl', yieldRange: '4-6 qtl/acre' },
    { name: 'Castor', emoji: '🌿', category: 'Oilseeds', region: 'India, Brazil', season: 'Kharif', soil: 'Sandy', water: 'Low', temp: '20-35°C', growDays: '120-180', uses: 'Industrial oil, lubricants, cosmetics', marketPrice: '₹6,500/qtl', yieldRange: '8-12 qtl/acre' },
    { name: 'Olive', emoji: '🫒', category: 'Oilseeds', region: 'Mediterranean', season: 'Year-round', soil: 'Loamy, Rocky', water: 'Low', temp: '15-30°C', growDays: 'Perennial', uses: 'Oil, table olives, cosmetics', marketPrice: '₹40,000/qtl', yieldRange: '5-10 qtl/acre/year' },
    { name: 'Oil Palm', emoji: '🌴', category: 'Oilseeds', region: 'SE Asia, Africa', season: 'Year-round', soil: 'Loamy, Laterite', water: 'High', temp: '24-32°C', growDays: 'Perennial', uses: 'Cooking oil, biodiesel, cosmetics', marketPrice: '₹8,000/qtl', yieldRange: '15-25 qtl/acre/year' },

    // VEGETABLES
    { name: 'Tomato', emoji: '🍅', category: 'Vegetables', region: 'Global', season: 'All seasons', soil: 'Loamy, Sandy', water: 'Medium', temp: '20-30°C', growDays: '60-80', uses: 'Cooking, sauce, ketchup, salads', marketPrice: '₹1,500/qtl', yieldRange: '80-120 qtl/acre' },
    { name: 'Potato', emoji: '🥔', category: 'Vegetables', region: 'Global', season: 'Rabi', soil: 'Sandy, Loamy', water: 'Medium', temp: '15-25°C', growDays: '70-120', uses: 'Cooking, chips, starch, vodka', marketPrice: '₹1,200/qtl', yieldRange: '80-120 qtl/acre' },
    { name: 'Onion', emoji: '🧅', category: 'Vegetables', region: 'Global', season: 'Rabi/Kharif', soil: 'Loamy, Sandy', water: 'Medium', temp: '15-30°C', growDays: '100-150', uses: 'Cooking, salads, dehydrated', marketPrice: '₹1,500/qtl', yieldRange: '60-100 qtl/acre' },
    { name: 'Cabbage', emoji: '🥬', category: 'Vegetables', region: 'Global', season: 'Winter', soil: 'Loamy', water: 'Medium', temp: '15-22°C', growDays: '70-100', uses: 'Cooking, coleslaw, kimchi', marketPrice: '₹800/qtl', yieldRange: '100-150 qtl/acre' },
    { name: 'Cauliflower', emoji: '🥦', category: 'Vegetables', region: 'Global', season: 'Winter', soil: 'Loamy, Clay', water: 'Medium', temp: '15-22°C', growDays: '60-100', uses: 'Cooking, pickles, rice substitute', marketPrice: '₹1,200/qtl', yieldRange: '80-120 qtl/acre' },
    { name: 'Carrot', emoji: '🥕', category: 'Vegetables', region: 'Global', season: 'Winter', soil: 'Sandy, Loamy', water: 'Medium', temp: '15-20°C', growDays: '70-90', uses: 'Cooking, juice, salads', marketPrice: '₹1,000/qtl', yieldRange: '80-120 qtl/acre' },
    { name: 'Brinjal (Eggplant)', emoji: '🍆', category: 'Vegetables', region: 'Asia, Mediterranean', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '22-30°C', growDays: '60-90', uses: 'Cooking, baingan bharta', marketPrice: '₹1,200/qtl', yieldRange: '100-150 qtl/acre' },
    { name: 'Okra (Bhindi)', emoji: '🌶️', category: 'Vegetables', region: 'Tropical', season: 'Kharif/Summer', soil: 'Loamy', water: 'Medium', temp: '25-35°C', growDays: '50-65', uses: 'Cooking, stir fry', marketPrice: '₹1,500/qtl', yieldRange: '40-60 qtl/acre' },
    { name: 'Spinach', emoji: '🥬', category: 'Vegetables', region: 'Global', season: 'Winter', soil: 'Loamy, Clay', water: 'Medium', temp: '10-20°C', growDays: '35-45', uses: 'Cooking, salads, smoothies', marketPrice: '₹600/qtl', yieldRange: '40-60 qtl/acre' },
    { name: 'Cucumber', emoji: '🥒', category: 'Vegetables', region: 'Global', season: 'Summer', soil: 'Sandy, Loamy', water: 'High', temp: '22-30°C', growDays: '50-70', uses: 'Salads, pickles, cosmetics', marketPrice: '₹800/qtl', yieldRange: '60-100 qtl/acre' },
    { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables', region: 'Global', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '20-30°C', growDays: '80-120', uses: 'Cooking, soups, pies, decoration', marketPrice: '₹500/qtl', yieldRange: '80-150 qtl/acre' },
    { name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables', region: 'Tropical', season: 'Kharif', soil: 'Sandy', water: 'Low-Medium', temp: '20-30°C', growDays: '90-150', uses: 'Cooking, chips, flour', marketPrice: '₹800/qtl', yieldRange: '60-100 qtl/acre' },
    { name: 'Radish', emoji: '🌶️', category: 'Vegetables', region: 'Global', season: 'Winter', soil: 'Loamy', water: 'Medium', temp: '10-20°C', growDays: '25-40', uses: 'Salads, cooking, pickles', marketPrice: '₹500/qtl', yieldRange: '60-100 qtl/acre' },
    { name: 'Garlic', emoji: '🧄', category: 'Vegetables', region: 'Global', season: 'Rabi', soil: 'Loamy', water: 'Medium', temp: '12-25°C', growDays: '120-150', uses: 'Cooking, medicine, pest control', marketPrice: '₹5,000/qtl', yieldRange: '30-50 qtl/acre' },
    { name: 'Ginger', emoji: '🫚', category: 'Vegetables', region: 'Tropical Asia', season: 'Kharif', soil: 'Loamy, Sandy', water: 'High', temp: '20-30°C', growDays: '200-250', uses: 'Cooking, tea, medicine', marketPrice: '₹4,000/qtl', yieldRange: '50-80 qtl/acre' },
    { name: 'Turmeric', emoji: '🟡', category: 'Vegetables', region: 'India, SE Asia', season: 'Kharif', soil: 'Loamy, Clay', water: 'High', temp: '20-30°C', growDays: '240-300', uses: 'Spice, medicine, dye, cosmetics', marketPrice: '₹8,000/qtl', yieldRange: '25-40 qtl/acre' },

    // FRUITS
    { name: 'Mango', emoji: '🥭', category: 'Fruits', region: 'India, SE Asia', season: 'Summer', soil: 'Loamy, Alluvial', water: 'Medium', temp: '24-35°C', growDays: 'Perennial', uses: 'Fresh eating, juice, pickle, dried', marketPrice: '₹3,000/qtl', yieldRange: '40-80 qtl/acre/year' },
    { name: 'Banana', emoji: '🍌', category: 'Fruits', region: 'Tropical', season: 'Year-round', soil: 'Loamy, Alluvial', water: 'High', temp: '25-35°C', growDays: '300-365', uses: 'Fresh eating, chips, flour', marketPrice: '₹1,200/qtl', yieldRange: '200-400 qtl/acre' },
    { name: 'Apple', emoji: '🍎', category: 'Fruits', region: 'Temperate', season: 'Summer-Fall', soil: 'Loamy', water: 'Medium', temp: '10-25°C', growDays: 'Perennial', uses: 'Fresh eating, juice, cider', marketPrice: '₹6,000/qtl', yieldRange: '40-80 qtl/acre/year' },
    { name: 'Grape', emoji: '🍇', category: 'Fruits', region: 'Mediterranean, Global', season: 'Summer', soil: 'Loamy, Sandy', water: 'Medium', temp: '15-30°C', growDays: 'Perennial', uses: 'Fresh eating, wine, raisins, juice', marketPrice: '₹4,000/qtl', yieldRange: '40-80 qtl/acre/year' },
    { name: 'Orange', emoji: '🍊', category: 'Fruits', region: 'Subtropical', season: 'Winter', soil: 'Loamy', water: 'Medium', temp: '15-30°C', growDays: 'Perennial', uses: 'Juice, fresh eating, marmalade', marketPrice: '₹3,500/qtl', yieldRange: '60-100 qtl/acre/year' },
    { name: 'Papaya', emoji: '🍈', category: 'Fruits', region: 'Tropical', season: 'Year-round', soil: 'Sandy, Loamy', water: 'Medium', temp: '25-35°C', growDays: '270-330', uses: 'Fresh eating, juice, cosmetics', marketPrice: '₹1,500/qtl', yieldRange: '100-200 qtl/acre' },
    { name: 'Guava', emoji: '🍈', category: 'Fruits', region: 'Tropical', season: 'Year-round', soil: 'Loamy', water: 'Low-Medium', temp: '23-30°C', growDays: 'Perennial', uses: 'Fresh eating, juice, jelly', marketPrice: '₹2,000/qtl', yieldRange: '60-100 qtl/acre/year' },
    { name: 'Pomegranate', emoji: '🫐', category: 'Fruits', region: 'India, Middle East', season: 'Summer', soil: 'Sandy, Loamy', water: 'Low', temp: '25-35°C', growDays: 'Perennial', uses: 'Fresh eating, juice, wine', marketPrice: '₹5,000/qtl', yieldRange: '30-50 qtl/acre/year' },
    { name: 'Watermelon', emoji: '🍉', category: 'Fruits', region: 'Global', season: 'Summer', soil: 'Sandy', water: 'Medium', temp: '25-35°C', growDays: '70-90', uses: 'Fresh eating, juice', marketPrice: '₹500/qtl', yieldRange: '150-250 qtl/acre' },
    { name: 'Strawberry', emoji: '🍓', category: 'Fruits', region: 'Temperate', season: 'Winter', soil: 'Sandy, Loamy', water: 'Medium', temp: '10-25°C', growDays: '60-90', uses: 'Fresh eating, jam, ice cream', marketPrice: '₹15,000/qtl', yieldRange: '20-40 qtl/acre' },
    { name: 'Pineapple', emoji: '🍍', category: 'Fruits', region: 'Tropical', season: 'Year-round', soil: 'Sandy, Loamy', water: 'Medium', temp: '22-32°C', growDays: '330-450', uses: 'Fresh eating, juice, canned', marketPrice: '₹2,000/qtl', yieldRange: '100-200 qtl/acre' },
    { name: 'Avocado', emoji: '🥑', category: 'Fruits', region: 'Americas, Africa', season: 'Year-round', soil: 'Loamy, Sandy', water: 'Medium', temp: '20-30°C', growDays: 'Perennial', uses: 'Fresh eating, guacamole, oil', marketPrice: '₹20,000/qtl', yieldRange: '20-40 qtl/acre/year' },

    // SPICES
    { name: 'Chili Pepper', emoji: '🌶️', category: 'Spices', region: 'India, Mexico, China', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '20-30°C', growDays: '60-90', uses: 'Spice, sauce, powder, medicine', marketPrice: '₹12,000/qtl', yieldRange: '15-25 qtl/acre' },
    { name: 'Black Pepper', emoji: '⚫', category: 'Spices', region: 'India, Vietnam', season: 'Kharif', soil: 'Laterite', water: 'High', temp: '20-30°C', growDays: 'Perennial', uses: 'Spice, medicine', marketPrice: '₹50,000/qtl', yieldRange: '2-4 qtl/acre/year' },
    { name: 'Cardamom', emoji: '🌿', category: 'Spices', region: 'India, Guatemala', season: 'Year-round', soil: 'Loamy, Forest', water: 'High', temp: '10-25°C', growDays: 'Perennial', uses: 'Spice, tea, desserts, medicine', marketPrice: '₹1,20,000/qtl', yieldRange: '0.5-1 qtl/acre/year' },
    { name: 'Cinnamon', emoji: '🌿', category: 'Spices', region: 'Sri Lanka, India', season: 'Year-round', soil: 'Sandy, Loamy', water: 'Medium', temp: '20-30°C', growDays: 'Perennial', uses: 'Spice, tea, medicine, cosmetics', marketPrice: '₹40,000/qtl', yieldRange: '1-3 qtl/acre/year' },
    { name: 'Vanilla', emoji: '🌿', category: 'Spices', region: 'Madagascar, India', season: 'Year-round', soil: 'Humus-rich', water: 'High', temp: '20-30°C', growDays: 'Perennial', uses: 'Flavoring, ice cream, perfume', marketPrice: '₹40,000/kg', yieldRange: 'Very Low' },
    { name: 'Saffron', emoji: '🧡', category: 'Spices', region: 'Iran, India (Kashmir)', season: 'Rabi', soil: 'Sandy, Loamy', water: 'Low', temp: '10-20°C', growDays: '90-100', uses: 'Spice, medicine, dye', marketPrice: '₹3,00,000/kg', yieldRange: 'Ultra Low (5kg/acre)' },

    // FIBER & INDUSTRIAL
    { name: 'Hemp', emoji: '🌿', category: 'Industrial', region: 'Global', season: 'Kharif', soil: 'Loamy', water: 'Medium', temp: '15-27°C', growDays: '80-120', uses: 'Fiber, paper, bioplastic, food', marketPrice: '₹10,000/qtl', yieldRange: '5-8 qtl/acre' },
    { name: 'Flax', emoji: '🌱', category: 'Industrial', region: 'Canada, Europe', season: 'Rabi', soil: 'Loamy', water: 'Low', temp: '15-25°C', growDays: '100-130', uses: 'Linen fiber, linseed oil, food', marketPrice: '₹8,000/qtl', yieldRange: '4-6 qtl/acre' },

    // FLOWERS
    { name: 'Rose', emoji: '🌹', category: 'Flowers', region: 'Global', season: 'Year-round', soil: 'Loamy', water: 'Medium', temp: '15-28°C', growDays: '42-60', uses: 'Decoration, perfume, rose water', marketPrice: '₹200-800/kg', yieldRange: '20-30 qtl/acre/year' },
    { name: 'Marigold', emoji: '🌼', category: 'Flowers', region: 'India, Americas', season: 'Kharif/Rabi', soil: 'Loamy', water: 'Medium', temp: '18-30°C', growDays: '50-70', uses: 'Decoration, dye, poultry feed', marketPrice: '₹40-150/kg', yieldRange: '30-50 qtl/acre' },
    { name: 'Jasmine', emoji: '🤍', category: 'Flowers', region: 'India, SE Asia', season: 'Year-round', soil: 'Loamy, Sandy', water: 'Medium', temp: '20-35°C', growDays: 'Perennial', uses: 'Decoration, perfume, tea', marketPrice: '₹300-1500/kg', yieldRange: '10-20 qtl/acre/year' },
]

const categories = ['All', 'Cereals', 'Pulses', 'Cash Crops', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices', 'Industrial', 'Flowers']

export default function CropEncyclopedia() {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedCrop, setSelectedCrop] = useState(null)
    const [sortBy, setSortBy] = useState('name')

    const filteredCrops = useMemo(() => {
        let crops = globalCrops
        if (selectedCategory !== 'All') {
            crops = crops.filter(c => c.category === selectedCategory)
        }
        if (search) {
            const q = search.toLowerCase()
            crops = crops.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                c.region.toLowerCase().includes(q) ||
                c.uses.toLowerCase().includes(q) ||
                c.soil.toLowerCase().includes(q)
            )
        }
        if (sortBy === 'name') crops = [...crops].sort((a, b) => a.name.localeCompare(b.name))
        if (sortBy === 'category') crops = [...crops].sort((a, b) => a.category.localeCompare(b.category))
        return crops
    }, [search, selectedCategory, sortBy])

    return (
        <section className="min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <span className="text-4xl mb-4 inline-block">🌍</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        Universal Crop{' '}
                        <span style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Encyclopedia
                        </span>
                    </h1>
                    <p className="font-body text-base opacity-60 max-w-xl mx-auto" style={{ color: 'var(--text-primary)' }}>
                        Explore {globalCrops.length}+ crop varieties from around the world — soil, climate, uses & market data
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <div className="glass-card p-6 mb-8 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by crop name, region, soil type, or use..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm font-body outline-none"
                            style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                            id="crop-search"
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-display font-bold transition-all ${selectedCategory === cat ? 'scale-105' : 'opacity-60 hover:opacity-100'
                                    }`}
                                style={{
                                    background: selectedCategory === cat ? 'var(--gradient-neon)' : 'var(--bg-glass)',
                                    color: selectedCategory === cat ? '#0a0f0d' : 'var(--text-primary)',
                                    border: selectedCategory === cat ? 'none' : '1px solid var(--border-glass)',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Count & Sort */}
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-mono opacity-50" style={{ color: 'var(--text-primary)' }}>
                            {filteredCrops.length} crops found
                        </span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg"
                            style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="category">Sort by Category</option>
                        </select>
                    </div>
                </div>

                {/* Crop Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCrops.map((crop, i) => (
                        <motion.div
                            key={crop.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.03, 0.5) }}
                            onClick={() => setSelectedCrop(crop)}
                            className="glass-card p-5 cursor-pointer group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl group-hover:scale-125 transition-transform">{crop.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                        {crop.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--neon-primary)' }}>
                                            {crop.category}
                                        </span>
                                        <span className="text-[10px] font-mono opacity-40" style={{ color: 'var(--text-primary)' }}>
                                            {crop.season}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-body mt-2 opacity-50 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                                        {crop.uses}
                                    </p>
                                    <div className="flex gap-3 mt-2 text-[10px] font-mono opacity-40" style={{ color: 'var(--text-primary)' }}>
                                        <span>🌡️ {crop.temp}</span>
                                        <span>💧 {crop.water}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail Modal */}
                <AnimatePresence>
                    {selectedCrop && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
                            onClick={() => setSelectedCrop(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-6xl">{selectedCrop.emoji}</span>
                                    <div>
                                        <h2 className="font-display text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                                            {selectedCrop.name}
                                        </h2>
                                        <span className="text-xs font-mono px-3 py-1 rounded-full"
                                            style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--neon-primary)' }}>
                                            {selectedCrop.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: '🌍', label: 'Growing Regions', value: selectedCrop.region },
                                        { icon: '📅', label: 'Season', value: selectedCrop.season },
                                        { icon: '🌍', label: 'Soil Type', value: selectedCrop.soil },
                                        { icon: '💧', label: 'Water Needs', value: selectedCrop.water },
                                        { icon: '🌡️', label: 'Temperature', value: selectedCrop.temp },
                                        { icon: '📆', label: 'Growth Duration', value: selectedCrop.growDays },
                                        { icon: '🎯', label: 'Uses', value: selectedCrop.uses },
                                        { icon: '💰', label: 'Market Price', value: selectedCrop.marketPrice },
                                        { icon: '📊', label: 'Yield Range', value: selectedCrop.yieldRange },
                                    ].map((item) => (
                                        <div key={item.label} className="flex gap-3 items-start">
                                            <span className="text-lg">{item.icon}</span>
                                            <div>
                                                <div className="text-xs font-mono opacity-40" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                                                <div className="text-sm font-body" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Link to="/planner" onClick={() => setSelectedCrop(null)}>
                                        <button className="btn-neon-filled text-xs py-2 px-5">🚀 Plan This Crop</button>
                                    </Link>
                                    <Link to="/doctor" onClick={() => setSelectedCrop(null)}>
                                        <button className="btn-neon text-xs py-2 px-5"><span>🔬 Diagnose Disease</span></button>
                                    </Link>
                                </div>

                                <button
                                    onClick={() => setSelectedCrop(null)}
                                    className="absolute top-4 right-4 text-xl opacity-50 hover:opacity-100"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    ✕
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
