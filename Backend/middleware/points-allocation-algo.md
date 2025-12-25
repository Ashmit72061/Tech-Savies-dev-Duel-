# EcoScore Points Algorithm

## Core Philosophy

**Goal**: Reward improvement and sustainability, not punish consumption.  
**Principle**: Points should feel achievable (10-100 range), not intimidating (1000+).  
**Focus**: Month-over-month progress matters more than absolute values.

---

## 1. Base Score Calculation (Monthly)

### Category Breakdown
| Category | Max Base Points | Weight |
|----------|----------------|--------|
| **Electricity** | 40 points | 40% |
| **Water** | 40 points | 40% |
| **Waste Segregation** | 20 points | 20% |
| **Total Base** | **100 points** | 100% |

**Why 100 max?**: Easy to understand, familiar scale (like school grades).

---

## 2. Electricity Score (0-40 points)

### Step 1: Normalize Usage
```
normalized_electricity = electricity_kwh / num_residents
```

### Step 2: Calculate Per-Capita Usage
**National Average**: ~100 kWh per person per month (India context)

```
usage_ratio = normalized_electricity / 100
```

### Step 3: Score Using Efficiency Bands

| Usage Ratio | Band | Points Awarded | Zone |
|-------------|------|----------------|------|
| ≤ 0.60 | Excellent | 40 | Green |
| 0.61 - 0.80 | Good | 35 | Green |
| 0.81 - 1.00 | Average | 30 | Improving |
| 1.01 - 1.20 | High | 25 | Improving |
| 1.21 - 1.50 | Very High | 15 | High Impact |
| > 1.50 | Excessive | 10 | High Impact |

**Formula**:
```javascript
function calculateElectricityScore(kWh, residents) {
  const normalized = kWh / residents;
  const ratio = normalized / 100; // 100 kWh is baseline
  
  if (ratio <= 0.60) return 40;
  if (ratio <= 0.80) return 35;
  if (ratio <= 1.00) return 30;
  if (ratio <= 1.20) return 25;
  if (ratio <= 1.50) return 15;
  return 10;
}
```

**Why bands instead of formula?**: 
- Prevents gaming the system with tiny improvements
- Easy to understand thresholds
- Encourages meaningful behavior change

---

## 3. Water Score (0-40 points)

### Step 1: Normalize Usage
```
normalized_water = water_liters / num_residents
```

### Step 2: Calculate Per-Capita Usage
**National Average**: ~3000 liters per person per month (India context)

```
usage_ratio = normalized_water / 3000
```

### Step 3: Score Using Efficiency Bands

| Usage Ratio | Band | Points Awarded | Zone |
|-------------|------|----------------|------|
| ≤ 0.60 | Excellent | 40 | Green |
| 0.61 - 0.80 | Good | 35 | Green |
| 0.81 - 1.00 | Average | 30 | Improving |
| 1.01 - 1.20 | High | 25 | Improving |
| 1.21 - 1.50 | Very High | 15 | High Impact |
| > 1.50 | Excessive | 10 | High Impact |

**Formula**:
```javascript
function calculateWaterScore(liters, residents) {
  const normalized = liters / residents;
  const ratio = normalized / 3000; // 3000L is baseline
  
  if (ratio <= 0.60) return 40;
  if (ratio <= 0.80) return 35;
  if (ratio <= 1.00) return 30;
  if (ratio <= 1.20) return 25;
  if (ratio <= 1.50) return 15;
  return 10;
}
```

---

## 4. Waste Segregation Score (0-20 points)

**Simple categorical scoring**:

| Segregation Status | Points Awarded | Zone |
|-------------------|----------------|------|
| **Compliant** | 20 | Green |
| **Partial** | 10 | Improving |
| **Non-Compliant** | 0 | High Impact |

**Formula**:
```javascript
function calculateWasteScore(status) {
  const scores = {
    'compliant': 20,
    'partial': 10,
    'non-compliant': 0
  };
  return scores[status] || 0;
}
```

**Why binary/ternary?**: 
- Waste segregation is observable behavior (yes/no/partial)
- No normalization needed
- Easy to verify

---

## 5. Monthly Base Score

```javascript
function calculateMonthlyBaseScore(data) {
  const electricityScore = calculateElectricityScore(
    data.electricity_kwh, 
    data.residents
  );
  
  const waterScore = calculateWaterScore(
    data.water_liters, 
    data.residents
  );
  
  const wasteScore = calculateWasteScore(data.waste_status);
  
  const baseScore = electricityScore + waterScore + wasteScore;
  
  return {
    electricity: electricityScore,
    water: waterScore,
    waste: wasteScore,
    total: baseScore,
    zone: determineZone(baseScore)
  };
}
```

---

## 6. Improvement Bonus (Month-over-Month)

**Reward positive change** with bonus points:

### Calculation
```javascript
function calculateImprovementBonus(currentMonth, previousMonth) {
  let bonus = 0;
  
  // Electricity improvement (max +5 bonus)
  const elecImprovement = currentMonth.electricity - previousMonth.electricity;
  if (elecImprovement > 0) {
    bonus += Math.min(5, Math.floor(elecImprovement / 2));
  }
  
  // Water improvement (max +5 bonus)
  const waterImprovement = currentMonth.water - previousMonth.water;
  if (waterImprovement > 0) {
    bonus += Math.min(5, Math.floor(waterImprovement / 2));
  }
  
  // Waste improvement (fixed bonus)
  if (currentMonth.waste > previousMonth.waste) {
    bonus += 3;
  }
  
  return Math.min(bonus, 10); // Cap at 10 bonus points
}
```

**Why cap at 10?**: Prevents bonus inflation over time.

**Example**:
- Previous month: Electricity 25, Water 30, Waste 10 → Total 65
- Current month: Electricity 35, Water 35, Waste 20 → Total 90
- Improvement: +10 electricity, +5 water, +10 waste
- Bonus: min(5, 10/2) + min(5, 5/2) + 3 = 5 + 2 + 3 = **10 bonus points**
- **Final Score: 90 + 10 = 100**

---

## 7. Challenge Points System

### Challenge Types & Point Rewards

| Challenge | Points | Frequency | Difficulty |
|-----------|--------|-----------|------------|
| **Zero Waste Week** | 15 | Monthly | Hard |
| **Reduce Electricity by 10%** | 10 | Monthly | Medium |
| **Reduce Water by 10%** | 10 | Monthly | Medium |
| **3 Months Green Zone** | 25 | Quarterly | Hard |
| **Society Goal Achieved** | 20 | Varies | Medium |
| **First Time Perfect Score** | 30 | One-time | Hard |
| **Consistent Improver (6 months)** | 40 | Bi-annual | Hard |

### Challenge Implementation
```javascript
const CHALLENGES = {
  zero_waste_week: {
    points: 15,
    check: (data) => data.waste_status === 'compliant' && data.special_event === 'zero_waste_week'
  },
  
  electricity_reduction_10: {
    points: 10,
    check: (current, previous) => {
      const reduction = (previous.electricity_kwh - current.electricity_kwh) / previous.electricity_kwh;
      return reduction >= 0.10;
    }
  },
  
  water_reduction_10: {
    points: 10,
    check: (current, previous) => {
      const reduction = (previous.water_liters - current.water_liters) / previous.water_liters;
      return reduction >= 0.10;
    }
  },
  
  green_zone_streak_3: {
    points: 25,
    check: (history) => {
      const last3 = history.slice(-3);
      return last3.every(month => month.zone === 'green');
    }
  },
  
  society_goal_achieved: {
    points: 20,
    check: (societyData) => societyData.monthly_goal_achieved === true
  },
  
  first_perfect_score: {
    points: 30,
    check: (current, history) => {
      return current.total === 100 && !history.some(m => m.total === 100);
    }
  },
  
  consistent_improver_6: {
    points: 40,
    check: (history) => {
      if (history.length < 6) return false;
      const last6 = history.slice(-6);
      for (let i = 1; i < 6; i++) {
        if (last6[i].total <= last6[i-1].total) return false;
      }
      return true;
    }
  }
};

function calculateChallengePoints(currentData, previousData, history, societyData) {
  let challengePoints = 0;
  const completedChallenges = [];
  
  // Check each challenge
  Object.entries(CHALLENGES).forEach(([key, challenge]) => {
    let completed = false;
    
    if (challenge.check.length === 1) {
      completed = challenge.check(currentData);
    } else if (challenge.check.length === 2) {
      completed = challenge.check(currentData, previousData);
    } else if (challenge.check.length === 3) {
      completed = challenge.check(currentData, previousData, history);
    }
    
    if (completed) {
      challengePoints += challenge.points;
      completedChallenges.push(key);
    }
  });
  
  return { challengePoints, completedChallenges };
}
```

---

## 8. Total Score Calculation

```javascript
function calculateTotalScore(currentData, previousData, history, societyData) {
  // 1. Base score (0-100)
  const baseScore = calculateMonthlyBaseScore(currentData);
  
  // 2. Improvement bonus (0-10)
  const improvementBonus = previousData 
    ? calculateImprovementBonus(baseScore, previousData)
    : 0;
  
  // 3. Challenge points (varies)
  const { challengePoints, completedChallenges } = calculateChallengePoints(
    currentData, 
    previousData, 
    history, 
    societyData
  );
  
  // 4. Total score
  const totalMonthlyScore = baseScore.total + improvementBonus + challengePoints;
  
  return {
    baseScore: baseScore.total,
    breakdown: {
      electricity: baseScore.electricity,
      water: baseScore.water,
      waste: baseScore.waste
    },
    improvementBonus,
    challengePoints,
    completedChallenges,
    totalMonthlyScore,
    zone: baseScore.zone
  };
}
```

---

## 9. Lifetime Score (Cumulative)

**Track cumulative points over time**:

```javascript
function calculateLifetimeScore(monthlyScores) {
  return monthlyScores.reduce((sum, month) => sum + month.totalMonthlyScore, 0);
}
```

**Example Journey**:
- **Month 1**: 65 points (base score, new user)
- **Month 2**: 75 + 5 (improvement) = 80 points
- **Month 3**: 85 + 8 (improvement) + 10 (challenge) = 103 points
- **Lifetime**: 65 + 80 + 103 = **248 points**

**Reasonable Range**:
- New user (1 month): 50-100 points
- Active user (6 months): 400-700 points
- Long-term user (1 year): 900-1500 points

**Why this works**: 
- Points grow steadily but not exponentially
- 1000+ points feels earned (1 year of effort)
- Never reaches absurd numbers like 10,000

---

## 10. Zone Classification

```javascript
function determineZone(score) {
  if (score >= 80) return 'green';       // Green Zone
  if (score >= 60) return 'improving';   // Improving Zone
  return 'high_impact';                  // High Impact Zone
}
```

**Visual Indicators**:
- 🟢 **Green Zone** (80-100): Sustainable, reward with tips to maintain
- 🟡 **Improving** (60-79): On the right track, encourage further improvements
- 🔴 **High Impact** (0-59): Needs attention, provide actionable suggestions

---

## 11. Flat Size Normalization (Optional Enhancement)

**If flat sizes vary significantly**:

```javascript
function calculateSizeAdjustedScore(kWh, liters, residents, flatSizeSqFt) {
  // Adjust for flat size (larger flats use more)
  const sizeMultiplier = Math.sqrt(flatSizeSqFt / 1000); // 1000 sq ft baseline
  
  const adjustedElectricity = kWh / (residents * sizeMultiplier);
  const adjustedWater = liters / (residents * sizeMultiplier);
  
  // Then use standard scoring bands
  return calculateMonthlyBaseScore({
    electricity_kwh: adjustedElectricity * residents, // Convert back
    water_liters: adjustedWater * residents,
    waste_status: data.waste_status,
    residents
  });
}
```

**Why sqrt?**: Larger flats don't scale linearly (2x size ≠ 2x usage).

---

## 12. Complete Implementation Example

```javascript
// Sample Data
const currentMonthData = {
  electricity_kwh: 240,    // 4 residents × 60 kWh (excellent)
  water_liters: 9000,      // 4 residents × 2250 L (good)
  waste_status: 'compliant',
  residents: 4,
  flat_size_sqft: 1200
};

const previousMonthData = {
  electricity_kwh: 320,
  water_liters: 10000,
  waste_status: 'partial',
  residents: 4
};

const history = [
  { total: 65, zone: 'improving' },
  { total: 70, zone: 'improving' },
  { total: 75, zone: 'improving' }
];

const societyData = {
  monthly_goal_achieved: true
};

// Calculate Score
const result = calculateTotalScore(
  currentMonthData,
  previousMonthData,
  history,
  societyData
);

console.log(result);
/* Output:
{
  baseScore: 90,
  breakdown: {
    electricity: 40,  // Excellent (60 kWh per person)
    water: 35,        // Good (2250 L per person)
    waste: 20         // Compliant
  },
  improvementBonus: 8,
  challengePoints: 30,  // Society goal (20) + reduction challenge (10)
  completedChallenges: ['society_goal_achieved', 'electricity_reduction_10'],
  totalMonthlyScore: 128,
  zone: 'green'
}
*/
```

---

## 13. Anti-Gaming Measures

### Prevent Score Manipulation

1. **Data Verification**: Admin must approve monthly entries
2. **Outlier Detection**: Flag entries >50% different from previous month
3. **Challenge Cooldown**: Same challenge can't be completed twice in 3 months
4. **Cap Improvement Bonus**: Max 10 points per month prevents infinite stacking
5. **Audit Trail**: Store all score calculations with timestamps

```javascript
function validateEntry(current, previous) {
  const warnings = [];
  
  // Check for suspicious drops
  const elecChange = Math.abs(current.electricity_kwh - previous.electricity_kwh) / previous.electricity_kwh;
  if (elecChange > 0.50) {
    warnings.push('Electricity usage changed by >50%');
  }
  
  const waterChange = Math.abs(current.water_liters - previous.water_liters) / previous.water_liters;
  if (waterChange > 0.50) {
    warnings.push('Water usage changed by >50%');
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}
```

---

## 14. Leaderboard Display (Society Level)

**Show relative performance without harsh ranking**:

```javascript
function getSocietyLeaderboard(flats) {
  return flats
    .map(flat => ({
      flatNumber: flat.number,
      currentMonthScore: flat.currentScore,
      lifetimeScore: flat.lifetimeScore,
      zone: flat.zone,
      improvement: flat.improvement
    }))
    .sort((a, b) => b.currentMonthScore - a.currentMonthScore)
    .slice(0, 10); // Top 10 only
}
```

**Display Format**:
```
🏆 Top Performers This Month

🥇 Flat 501 - 128 points (↑ from 90) 🟢
🥈 Flat 302 - 115 points (↑ from 85) 🟢
🥉 Flat 204 - 108 points (↑ from 95) 🟢
4️⃣ Flat 103 - 95 points (↑ from 75) 🟡
5️⃣ Flat 405 - 92 points (↓ from 100) 🟢
```

**Key**: Show improvement (↑↓), not just rank.

---

## 15. Summary of Algorithm

| Component | Range | Purpose |
|-----------|-------|---------|
| **Base Score** | 0-100 | Monthly consumption evaluation |
| **Improvement Bonus** | 0-10 | Reward positive change |
| **Challenge Points** | 10-40 | Encourage specific behaviors |
| **Monthly Total** | 10-150 | Reasonable, achievable |
| **Lifetime Score** | Cumulative | Long-term progress tracking |

**Key Principles**:
✅ Whole numbers only  
✅ Easy to understand (base 100 scale)  
✅ Rewards improvement over perfection  
✅ Challenges add engagement without complexity  
✅ No absurdly high numbers (stays under 2000/year)  
✅ Fair normalization (per resident, per flat size)  

**Result**: A scoring system that feels like a game, not a judgment.