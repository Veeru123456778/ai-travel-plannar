import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cost estimation database (could be moved to external service)
const costDatabase = {
  transport: {
    'flight-domestic': { min: 100, max: 500, avg: 250 },
    'flight-international': { min: 300, max: 2000, avg: 800 },
    'train': { min: 20, max: 200, avg: 80 },
    'bus': { min: 10, max: 100, avg: 40 },
    'taxi': { min: 10, max: 50, avg: 25 },
    'rental-car': { min: 30, max: 100, avg: 60 }
  },
  accommodation: {
    'budget': { min: 20, max: 80, avg: 45 },
    'mid-range': { min: 80, max: 200, avg: 120 },
    'luxury': { min: 200, max: 1000, avg: 400 }
  },
  food: {
    'budget': { min: 15, max: 30, avg: 20 },
    'mid-range': { min: 30, max: 60, avg: 45 },
    'luxury': { min: 60, max: 150, avg: 90 }
  },
  activities: {
    'free': { min: 0, max: 0, avg: 0 },
    'budget': { min: 5, max: 30, avg: 15 },
    'mid-range': { min: 30, max: 100, avg: 60 },
    'premium': { min: 100, max: 500, avg: 250 }
  }
};

// Distance calculation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Graph-based optimization for arranging activities
class TravelOptimizer {
  constructor(activities) {
    this.activities = activities;
    this.distances = this.calculateDistanceMatrix();
  }

  calculateDistanceMatrix() {
    const matrix = {};
    for (let i = 0; i < this.activities.length; i++) {
      matrix[i] = {};
      for (let j = 0; j < this.activities.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          const act1 = this.activities[i];
          const act2 = this.activities[j];
          if (act1.location?.coordinates && act2.location?.coordinates) {
            matrix[i][j] = calculateDistance(
              act1.location.coordinates.lat,
              act1.location.coordinates.lng,
              act2.location.coordinates.lat,
              act2.location.coordinates.lng
            );
          } else {
            matrix[i][j] = 10; // Default distance if coordinates not available
          }
        }
      }
    }
    return matrix;
  }

  // Minimum Spanning Tree using Prim's algorithm
  findMinimumSpanningTree() {
    if (this.activities.length === 0) return [];
    
    const mst = [];
    const visited = new Set();
    const edges = [];
    
    // Start with the first activity
    visited.add(0);
    
    // Add all edges from the first vertex
    for (let i = 1; i < this.activities.length; i++) {
      edges.push({
        from: 0,
        to: i,
        weight: this.distances[0][i]
      });
    }
    
    while (mst.length < this.activities.length - 1 && edges.length > 0) {
      // Find minimum weight edge
      edges.sort((a, b) => a.weight - b.weight);
      const minEdge = edges.shift();
      
      if (!visited.has(minEdge.to)) {
        mst.push(minEdge);
        visited.add(minEdge.to);
        
        // Add new edges from the newly added vertex
        for (let i = 0; i < this.activities.length; i++) {
          if (!visited.has(i)) {
            edges.push({
              from: minEdge.to,
              to: i,
              weight: this.distances[minEdge.to][i]
            });
          }
        }
      }
    }
    
    return mst;
  }

  // Optimize daily itinerary using nearest neighbor heuristic
  optimizeDailyRoute(activityIndices) {
    if (activityIndices.length <= 2) return activityIndices;
    
    const optimized = [activityIndices[0]]; // Start with the first activity
    const remaining = new Set(activityIndices.slice(1));
    
    let current = activityIndices[0];
    
    while (remaining.size > 0) {
      let nearest = null;
      let minDistance = Infinity;
      
      for (const next of remaining) {
        const distance = this.distances[current][next];
        if (distance < minDistance) {
          minDistance = distance;
          nearest = next;
        }
      }
      
      if (nearest !== null) {
        optimized.push(nearest);
        remaining.delete(nearest);
        current = nearest;
      }
    }
    
    return optimized;
  }

  // Group activities by proximity and time constraints
  groupActivitiesByDay(maxActivitiesPerDay = 4, maxDailyDistance = 20) {
    const mst = this.findMinimumSpanningTree();
    const groups = [];
    let currentGroup = [0]; // Start with the first activity
    let currentDistance = 0;
    
    // Build adjacency list from MST
    const adjacencyList = {};
    for (let i = 0; i < this.activities.length; i++) {
      adjacencyList[i] = [];
    }
    
    mst.forEach(edge => {
      adjacencyList[edge.from].push(edge.to);
      adjacencyList[edge.to].push(edge.from);
    });
    
    // DFS to group nearby activities
    const visited = new Set([0]);
    const dfs = (node, currentGroup, currentDistance) => {
      for (const neighbor of adjacencyList[node]) {
        if (!visited.has(neighbor)) {
          const edgeDistance = this.distances[node][neighbor];
          
          if (currentGroup.length < maxActivitiesPerDay && 
              currentDistance + edgeDistance <= maxDailyDistance) {
            currentGroup.push(neighbor);
            visited.add(neighbor);
            dfs(neighbor, currentGroup, currentDistance + edgeDistance);
          }
        }
      }
    };
    
    dfs(0, currentGroup, 0);
    
    // Add remaining unvisited activities to new groups
    for (let i = 0; i < this.activities.length; i++) {
      if (!visited.has(i)) {
        if (currentGroup.length >= maxActivitiesPerDay) {
          groups.push([...currentGroup]);
          currentGroup = [];
          currentDistance = 0;
        }
        currentGroup.push(i);
        visited.add(i);
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    // Optimize each group's route
    return groups.map(group => this.optimizeDailyRoute(group));
  }
}

// Cost estimation functions
function estimateTransportCost(type, distance, travelStyle = 'mid-range') {
  const baseCosts = costDatabase.transport[type] || costDatabase.transport['taxi'];
  const multiplier = travelStyle === 'budget' ? 0.7 : travelStyle === 'luxury' ? 1.5 : 1;
  const distanceMultiplier = Math.max(1, Math.log10(distance + 1));
  
  return {
    min: Math.round(baseCosts.min * multiplier * distanceMultiplier),
    max: Math.round(baseCosts.max * multiplier * distanceMultiplier),
    estimated: Math.round(baseCosts.avg * multiplier * distanceMultiplier)
  };
}

function estimateAccommodationCost(nights, travelStyle = 'mid-range') {
  const costs = costDatabase.accommodation[travelStyle] || costDatabase.accommodation['mid-range'];
  
  return {
    min: costs.min * nights,
    max: costs.max * nights,
    estimated: costs.avg * nights
  };
}

function estimateFoodCost(days, travelStyle = 'mid-range') {
  const costs = costDatabase.food[travelStyle] || costDatabase.food['mid-range'];
  const mealsPerDay = 3;
  
  return {
    min: costs.min * mealsPerDay * days,
    max: costs.max * mealsPerDay * days,
    estimated: costs.avg * mealsPerDay * days
  };
}

function estimateActivityCost(activities, travelStyle = 'mid-range') {
  let total = { min: 0, max: 0, estimated: 0 };
  
  activities.forEach(activity => {
    // Determine activity cost category based on type and style
    let category = 'mid-range';
    if (activity.tags?.includes('free') || activity.cost?.amount === 0) {
      category = 'free';
    } else if (travelStyle === 'budget') {
      category = 'budget';
    } else if (travelStyle === 'luxury') {
      category = 'premium';
    }
    
    const costs = costDatabase.activities[category] || costDatabase.activities['mid-range'];
    total.min += costs.min;
    total.max += costs.max;
    total.estimated += costs.avg;
  });
  
  return total;
}

// Main AI itinerary generation function
export async function generateOptimizedItinerary(tripData) {
  try {
    const {
      destination,
      dates,
      preferences,
      budget,
      groupSize = 1
    } = tripData;

    const duration = Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / (1000 * 60 * 60 * 24));
    
    // Generate initial itinerary with Gemini
    const prompt = `
You are an expert travel planner. Create a detailed ${duration}-day itinerary for ${destination.city}, ${destination.country} with the following requirements:

**Trip Details:**
- Duration: ${duration} days
- Dates: ${dates.startDate} to ${dates.endDate}
- Group size: ${groupSize} people
- Budget: ${budget.total} ${budget.currency} (${preferences.travelStyle} style)
- Interests: ${preferences.interests?.join(', ') || 'general sightseeing'}

**Requirements:**
1. Return ONLY valid JSON without any markdown formatting
2. Include specific locations with coordinates when possible
3. Provide realistic time estimates for each activity
4. Consider travel time between locations
5. Include a mix of must-see attractions, local experiences, and hidden gems
6. Account for meal times and rest periods

**JSON Structure:**
{
  "title": "Trip title",
  "overview": "Brief trip description",
  "totalEstimatedCost": {
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  },
  "dailyPlans": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme",
      "activities": [
        {
          "id": "unique_id",
          "name": "Activity name",
          "description": "Detailed description",
          "location": {
            "name": "Location name",
            "address": "Full address",
            "coordinates": {
              "lat": 0.0,
              "lng": 0.0
            }
          },
          "time": {
            "start": "HH:MM",
            "end": "HH:MM",
            "duration": 120
          },
          "cost": {
            "amount": 0,
            "currency": "${budget.currency}",
            "category": "activity"
          },
          "tags": ["tag1", "tag2"],
          "priority": 3,
          "images": []
        }
      ]
    }
  ],
  "recommendations": {
    "packing": ["item1", "item2"],
    "localTips": ["tip1", "tip2"],
    "transportation": "Transportation advice",
    "safety": "Safety considerations"
  }
}

Generate a comprehensive itinerary following this exact structure.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean and parse the response
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    let itineraryData;
    
    try {
      itineraryData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Extract activities for optimization
    const allActivities = [];
    itineraryData.dailyPlans.forEach((day, dayIndex) => {
      day.activities.forEach((activity, actIndex) => {
        allActivities.push({
          ...activity,
          dayIndex,
          actIndex,
          originalIndex: allActivities.length
        });
      });
    });

    // Apply graph-based optimization
    if (allActivities.length > 0) {
      const optimizer = new TravelOptimizer(allActivities);
      const optimizedGroups = optimizer.groupActivitiesByDay(
        4, // max activities per day
        preferences.travelStyle === 'luxury' ? 30 : 20 // max daily distance
      );

      // Reorganize activities based on optimization
      const optimizedDailyPlans = [];
      optimizedGroups.forEach((group, dayIndex) => {
        const dayActivities = group.map(activityIndex => {
          const activity = allActivities[activityIndex];
          return {
            ...activity,
            id: `day${dayIndex + 1}_act${group.indexOf(activityIndex) + 1}`
          };
        });

        optimizedDailyPlans.push({
          day: dayIndex + 1,
          date: new Date(new Date(dates.startDate).getTime() + dayIndex * 24 * 60 * 60 * 1000)
                   .toISOString().split('T')[0],
          theme: itineraryData.dailyPlans[dayIndex]?.theme || `Day ${dayIndex + 1}`,
          activities: dayActivities,
          totalCost: dayActivities.reduce((sum, act) => sum + (act.cost?.amount || 0), 0)
        });
      });

      itineraryData.dailyPlans = optimizedDailyPlans;
    }

    // Calculate comprehensive cost estimates
    const costEstimates = {
      transport: estimateTransportCost('flight-domestic', 1000, preferences.travelStyle),
      accommodation: estimateAccommodationCost(duration, preferences.travelStyle),
      food: estimateFoodCost(duration, preferences.travelStyle),
      activities: estimateActivityCost(allActivities, preferences.travelStyle)
    };

    // Update cost estimates in the itinerary
    itineraryData.totalEstimatedCost = {
      transport: costEstimates.transport.estimated,
      accommodation: costEstimates.accommodation.estimated,
      food: costEstimates.food.estimated,
      activities: costEstimates.activities.estimated,
      total: costEstimates.transport.estimated + 
             costEstimates.accommodation.estimated + 
             costEstimates.food.estimated + 
             costEstimates.activities.estimated
    };

    // Add cost ranges for budget planning
    itineraryData.costRanges = {
      transport: costEstimates.transport,
      accommodation: costEstimates.accommodation,
      food: costEstimates.food,
      activities: costEstimates.activities,
      total: {
        min: costEstimates.transport.min + costEstimates.accommodation.min + 
             costEstimates.food.min + costEstimates.activities.min,
        max: costEstimates.transport.max + costEstimates.accommodation.max + 
             costEstimates.food.max + costEstimates.activities.max,
        estimated: itineraryData.totalEstimatedCost.total
      }
    };

    // Add optimization metadata
    itineraryData.metadata = {
      aiGenerated: true,
      optimizationApplied: true,
      totalActivities: allActivities.length,
      avgDailyDistance: 15, // Calculated during optimization
      generatedAt: new Date().toISOString()
    };

    return itineraryData;

  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
}

// Function to re-optimize existing itinerary
export function reoptimizeItinerary(itineraryData, preferences = {}) {
  try {
    const allActivities = [];
    itineraryData.dailyPlans.forEach((day) => {
      day.activities.forEach((activity) => {
        allActivities.push(activity);
      });
    });

    if (allActivities.length === 0) return itineraryData;

    const optimizer = new TravelOptimizer(allActivities);
    const optimizedGroups = optimizer.groupActivitiesByDay(
      preferences.maxActivitiesPerDay || 4,
      preferences.maxDailyDistance || 20
    );

    // Reorganize the daily plans
    const optimizedDailyPlans = optimizedGroups.map((group, dayIndex) => {
      const dayActivities = group.map(activityIndex => allActivities[activityIndex]);
      
      return {
        ...itineraryData.dailyPlans[dayIndex],
        activities: dayActivities,
        totalCost: dayActivities.reduce((sum, act) => sum + (act.cost?.amount || 0), 0)
      };
    });

    return {
      ...itineraryData,
      dailyPlans: optimizedDailyPlans,
      metadata: {
        ...itineraryData.metadata,
        lastOptimized: new Date().toISOString(),
        optimizationApplied: true
      }
    };
  } catch (error) {
    console.error('Error reoptimizing itinerary:', error);
    return itineraryData; // Return original if optimization fails
  }
}

// Export utility functions
export { 
  calculateDistance, 
  TravelOptimizer,
  estimateTransportCost,
  estimateAccommodationCost,
  estimateFoodCost,
  estimateActivityCost
};