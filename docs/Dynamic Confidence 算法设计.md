# **用户国籍动态置信度更新算法**

## **背景与目标**

为了准确地判断用户的国籍并动态调整其置信度，该算法利用两组数据：历史后端存储的用户国籍数据（`beData`）和最新国籍数据（`newData`）。算法的目标是通过比较两组数据，动态调整置信度，并决定是否更新用户的国籍。

### **算法目标**
1. 动态更新置信度，使其能够根据最新输入数据和时间差平滑增长或衰减。
2. 在国籍不同的情况下，通过衰减置信度或直接更新国籍信息，平衡模型的敏感性与稳定性。
3. 避免置信度值的突增或突降，确保预测结果的可信度具有一致性和可靠性。

---

## **算法设计与实现**

### **动态置信度更新函数**

#### **核心思路**
1. 使用时间衰减权重，根据时间差动态调整置信度的增长或衰减幅度。
2. 当 `nationISO` 相同时，使用渐近增长模型平滑增加置信度。
3. 当 `nationISO` 不同时，通过动态衰减置信度降低旧国籍的可信度。在有必要的时候直接进行替换
4. 确保置信度始终在 $[0, 0.99]$ 范围内。

#### **主要公式**
- **置信度增加公式**：
  $$
  C_{\text{new}} = C_{\text{old}} + \gamma_{\text{inc}} \cdot (C_{\text{obs}} - C_{\text{old}}) \cdot e^{-\alpha \Delta t}
  $$
  其中：
  - $C_{\text{new}}$：更新后的置信度。
  - $C_{\text{old}}$：当前置信度。
  - $C_{\text{obs}}$：新数据的置信度。
  - $e^{-\alpha \Delta t}$：时间衰减因子。
  - $\gamma_{\text{inc}}$：增长速率。

- **置信度减少公式**：
  $$
  C_{\text{decayed}} = C_{\text{old}} \cdot (1 - \gamma_{\text{decay}} \cdot e^{-\beta \Delta t})
  $$
  其中：
  - $C_{\text{decayed}}$：衰减后的置信度。
  - $C_{\text{old}}$：当前置信度。
  - $e^{-\beta \Delta t}$：时间衰减因子。
  - $\gamma_{\text{decay}}$：衰减速率。

---