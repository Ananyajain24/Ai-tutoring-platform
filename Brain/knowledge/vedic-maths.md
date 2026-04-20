# Vedic Maths Knowledge Base

This file is the primary RAG source for the AI Vedic Maths Tutor.
Each section is a retrievable chunk. Sections are separated by `---` for chunking.

---

## SUTRA: Nikhilam Navatashcaramam Dashatah
**Translation:** "All from 9, last from 10"
**Use case:** Multiplication of numbers close to a base (10, 100, 1000)

### How It Works
1. Choose a base (nearest power of 10).
2. Find each number's deviation: `deviation = number - base`
3. Cross-add: `result_left = number1 + deviation2` (or `number2 + deviation1` — same result)
4. Multiply deviations: `result_right = deviation1 × deviation2`
5. Combine: `final = result_left | result_right` (right part has as many digits as zeros in the base)

### Rules
- If both numbers are below the base, deviations are negative. The right-side product is positive (negative × negative).
- If one number is above and one below, the right-side product is negative — subtract it.
- Right side must be padded to match the number of zeros in the base (e.g., base 100 → right side is 2 digits).

### Example 1: 98 × 97 (base 100)
- Deviations: 98 - 100 = -2, 97 - 100 = -3
- Left: 98 + (-3) = 95
- Right: (-2) × (-3) = 06 (padded to 2 digits)
- Answer: **9506**

### Example 2: 9 × 8 (base 10)
- Deviations: 9 - 10 = -1, 8 - 10 = -2
- Left: 9 + (-2) = 7
- Right: (-1) × (-2) = 2
- Answer: **72**

### Example 3: 103 × 104 (base 100, above base)
- Deviations: +3, +4
- Left: 103 + 4 = 107
- Right: 3 × 4 = 12
- Answer: **10712**

### Example 4: 102 × 98 (mixed: one above, one below)
- Deviations: +2, -2
- Left: 102 + (-2) = 100
- Right: 2 × (-2) = -04 → 100 × 100 - 4 = **9996**

---

## SUTRA: Urdhva Tiryagbhyam
**Translation:** "Vertically and Crosswise"
**Use case:** General multiplication of any two numbers (works for all cases)

### How It Works (2-digit × 2-digit)
For `AB × CD` where A, B, C, D are digits:

```
Step 1 (rightmost): B × D                        → units digit, carry C1
Step 2 (cross):     (A × D) + (B × C) + C1       → tens digit, carry C2
Step 3 (leftmost):  A × C + C2                    → hundreds digit
```

Final answer: Step3 | Step2 | Step1

### Example: 23 × 41
- Step 1: 3 × 1 = 3 (units = 3, carry = 0)
- Step 2: (2 × 1) + (3 × 4) + 0 = 2 + 12 = 14 (tens = 4, carry = 1)
- Step 3: 2 × 4 + 1 = 9 (hundreds = 9)
- Answer: **943**

### Example: 97 × 85
- Step 1: 7 × 5 = 35 (units = 5, carry = 3)
- Step 2: (9 × 5) + (7 × 8) + 3 = 45 + 56 + 3 = 104 (tens = 4, carry = 10)
- Step 3: 9 × 8 + 10 = 82 (hundreds/thousands = 82)
- Answer: **8245**

### Extension: 3-digit × 3-digit (ABC × DEF)
```
Step 1: C × F
Step 2: B×F + C×E
Step 3: A×F + B×E + C×D
Step 4: A×E + B×D
Step 5: A×D
```
Combine with carry propagation right to left.

---

## SUTRA: Anurupyena
**Translation:** "Proportionality"
**Use case:** Multiplication using a sub-base (multiple of a base)

### How It Works
When numbers are close to a sub-base (e.g., 50 = 100/2, 200 = 100×2):
1. Use the main base (100) for deviation calculation.
2. Multiply the left part by the ratio (sub-base / main base).

### Example: 48 × 47 (sub-base 50 = 100/2)
- Deviations from 50: -2, -3
- Left: 48 + (-3) = 45 → multiply by ratio (50/100 = 1/2) → 45/2 = 22.5... 

Alternative approach — use base 100:
- Deviations from 100: -52, -53 (too large for Nikhilam, so Anurupyena instead)
- Sub-base 50: deviations -2, -3
- Left: 48 - 3 = 45; divide by 2 = 22 remainder 50 → left = 22, carry 50 to right
- Right: (-2) × (-3) = 6; add carry 50 → 56
- Answer: 22 | 56 = **2256**

---

## SUTRA: Ekadhikena Purvena
**Translation:** "By one more than the previous one"
**Use case:** Squaring numbers ending in 5; specific fraction patterns

### Squaring numbers ending in 5
For any number `N5` (N is the digits before 5):
- Left part: `N × (N + 1)`
- Right part: always `25`

### Example: 35²
- N = 3, N+1 = 4
- Left: 3 × 4 = 12
- Right: 25
- Answer: **1225**

### Example: 75²
- N = 7, N+1 = 8
- Left: 7 × 8 = 56
- Right: 25
- Answer: **5625**

### Example: 105²
- N = 10, N+1 = 11
- Left: 10 × 11 = 110
- Right: 25
- Answer: **11025**

---

## SUTRA: Yavadunam
**Translation:** "Whatever the extent of its deficiency"
**Use case:** Squaring numbers close to a base

### How It Works
For `N² where N is close to base B`:
- Deficiency `d = N - B`
- Left: `N + d` (i.e., `2N - B`)
- Right: `d²` (padded to match base zeros)

### Example: 98² (base 100)
- d = 98 - 100 = -2
- Left: 98 + (-2) = 96
- Right: (-2)² = 04
- Answer: **9604**

### Example: 103² (base 100)
- d = +3
- Left: 103 + 3 = 106
- Right: 3² = 09
- Answer: **10609**

---

## SUTRA: Nikhilam — Division
**Translation:** (Same sutra applied to division)
**Use case:** Division where divisor is close to a base

### How It Works (divisor just below base)
For dividing `N ÷ D` where D is close to 100:
1. Complement of D = `100 - D`
2. Bring down first digit of dividend as partial quotient.
3. Multiply complement by partial quotient, add to remaining digits.
4. Repeat until remainder < D.

### Example: 1225 ÷ 9 (base 10, complement = 1)
- Bring down 1 → Q digit = 1, multiply 1×1=1, add to 2 → 3
- Q digit = 3, multiply 3×1=3, add to 2 → 5
- Q digit = 5, multiply 5×1=5 → remainder 5+5=10... carry
- Answer: **136 remainder 1**

---

## SUTRA: Ankur (Digit Sum / Beejank)
**Translation:** "Seed digit"
**Use case:** Verification of multiplication results (casting out 9s)

### How It Works
1. Find the digit sum (beejank) of each number: repeatedly sum digits until single digit.
2. Multiply the beejanks.
3. Find beejank of the product.
4. If it matches the beejank of your calculated answer → likely correct.

### Example: Verify 97 × 85 = 8245
- Beejank(97) = 9+7 = 16 → 1+6 = 7
- Beejank(85) = 8+5 = 13 → 1+3 = 4
- 7 × 4 = 28 → 2+8 = 10 → 1+0 = 1
- Beejank(8245) = 8+2+4+5 = 19 → 1+9 = 10 → 1
- Both = 1 → **Answer verified**

---

## SUTRA: Vinculum (Complement Representation)
**Translation:** Bar notation
**Use case:** Simplifying multiplication by converting large digits to small ones

### How It Works
Large digits (6, 7, 8, 9) can be rewritten using their complement from 10:
- 8 → (10 - 2) → write as 1 with bar-2 (complement form)
- This converts e.g. 98 → 102̄ (one hundred, zero, bar-2)

Used internally to simplify Urdhva Tiryagbhyam steps when digits are large.

---

## CONCEPT: Base System Summary

| Base | Use when numbers are near | Right-side digit count |
|------|--------------------------|------------------------|
| 10   | 7–13                     | 1                      |
| 100  | 85–115                   | 2                      |
| 1000 | 900–1100                 | 3                      |
| 50   | 45–55 (sub-base)         | 2 (divide left by 2)   |
| 200  | 180–220 (sub-base)       | 2 (multiply left by 2) |

---

## CONCEPT: When to Use Which Sutra

| Situation                              | Recommended Sutra          |
|----------------------------------------|----------------------------|
| Both numbers near a base (10/100/1000) | Nikhilam                   |
| General multiplication (any numbers)  | Urdhva Tiryagbhyam         |
| Numbers near a sub-base (50, 200)      | Anurupyena                 |
| Squaring number ending in 5            | Ekadhikena Purvena         |
| Squaring number near a base            | Yavadunam                  |
| Verifying an answer                    | Ankur (Beejank / digit sum)|

---

## GLOSSARY

| Term          | Meaning                                              |
|---------------|------------------------------------------------------|
| Sutra         | A concise rule or formula (Sanskrit)                 |
| Base          | Reference point (10, 100, 1000)                      |
| Deviation     | How far a number is from the base (can be negative)  |
| Beejank       | Seed digit — digit sum reduced to single digit       |
| Vinculum      | Bar notation for negative/complement digits          |
| Carry         | Overflow from one column to the next                 |
| Complement    | 10's complement: `10 - digit`; 9's complement: `9 - digit` |
