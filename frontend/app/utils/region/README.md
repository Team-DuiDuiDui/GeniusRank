# 用户国籍预测算法说明文档

## 算法整体思路

算法的目标是通过综合考虑以下因素来预测用户的国籍：

- **时间衰减权重**：早期的粉丝或关注者对用户国籍的影响更大。
- **社交影响力权重**：粉丝或关注者的社交活跃程度对权重有影响。
- **地理位置权重**：粉丝或关注者的地理位置频率和全球分布。
- **先验概率调整**：结合全球用户分布，调整地理位置的权重。
- **信息量的引入**：罕见的地理位置携带更多的信息量。
- **置信度计算**：基于熵的计算，得到预测结果的置信度。
---
## 算法主要内容
$$
\text{NationPrediction}( \text{fansList}, \text{followersList} ) = 
\frac{\text{sort} \left(\sum_{i \in \text{fansList}} \sum_{j \in \text{followersList}} 
\Big( 
    \text{Confidence}(\text{fansList}_i, \text{followersList}_j) \cdot
    \text{PosteriorProbability}(\text{fansList}_i, \text{followersList}_j) 
\Big) \right)}{\sum_{k=1}^N \text{totalProbability}}
$$
**其中：**

$$
1. \quad \text{时间衰减权重} : \quad T(t_i) = e^{-\alpha t_i}, \quad \alpha = \frac{\ln(2)}{N / 2} 
$$

$$
2. \quad \text{社交影响力权重} : \quad W_{\text{social}}(n_i) = \frac{1}{1 + \log(1 + \text{min}(n_i + 1, n_{\text{max}}))}
$$

$$
3. \quad \text{信息量计算} : \quad I(c_k) = -\log \max(P(c_k), 1 \times 10^{-6})
$$

$$
4. \quad \text{先验概率} : \quad P(c_k) = \frac{\text{globalLocationDistribution}[c_k]}{\sum \text{globalLocationDistribution}}
$$

$$
5. \quad \text{后验概率} : \quad P(c_k | D) = \frac{W(c_k)}{\sum_j W(c_j)}, \quad W(c_k) = \sum_{i \in c_k} \Big(T(t_i) \cdot W_{\text{social}}(n_i) \cdot I(c_k)\Big)
$$

$$
6. \quad \text{熵计算} : \quad H = -\sum_k P(c_k | D) \log P(c_k | D), \quad H_{\text{normalized}} = \frac{H}{\log N}
$$

$$
7. \quad \text{置信度} : \quad \text{Confidence} = \max\left(0, \min\left(1, 1 - H_{\text{normalized}}\right)\right)
$$

$$
8. \quad \text{总权重} : \quad \text{TotalWeight} = \sum_{i=1}^N W(c_i)
$$

$$
9. \quad \text{归一化概率} : \quad \text{Normalized Probability} = \frac{\text{weight}_i}{\text{TotalWeight}}, \quad i \in \text{combinedResults}
$$
---

## 详细说明

### 1. 时间衰减权重

**目的**：早期的粉丝或关注者通常与用户关系更密切，有更大概率是用户的身边的朋友之类的人，因此在预测中应赋予更大的权重。

**数学模型**：

- **指数衰减函数**：

  $$
  T(t_i) = e^{-\alpha t_i}
  $$

  其中，$t_i$ 为用户在列表中的索引位置，$\alpha$ 为时间衰减系数。

- **时间衰减系数 $\alpha$**：

  $$
  \alpha = \frac{\ln(2)}{N/2}
  $$

  其中，$N$ 为列表长度。这样确保在列表中间位置，时间权重减半。

**解决的问题**：通过时间衰减，使得早期的粉丝或关注者在预测中占更大的比重。

---

### 2. 社交影响力权重

**目的**：衡量粉丝或关注者的社交活跃程度，避免异常值对预测的影响。

**数学模型**：

- **社交影响力权重函数**：

  $$
  W_{\text{social}}(n_i) = \frac{1}{1 + \log(1 + n_i)}
  $$

  其中，$n_i$ 为用户的粉丝数或关注数。

- **异常值处理**：设置最大阈值 $n_{\text{max}}$，调整 $n_i$：

  $$
  n_i' = \min(n_i + 1, n_{\text{max}})
  $$

**解决的问题**：降低高粉丝数或高关注数用户对权重的过度影响。

---

### 3. 地理位置标准化

**目的**：将用户提供的地理位置信息标准化，便于匹配和统计。

**实现思路**：

- 去除"NULL"、"null" 等空值和无效值。
- 对地理位置字符串进行清洗和统一格式化。

**解决的问题**：确保地理位置信息的一致性，提高匹配准确性。

---

### 4. 信息量的引入

**目的**：罕见的地理位置携带更多的信息量，应该在权重中体现。

**数学模型**：

- **信息量计算**：

  $$
  I(c_k) = -\log P(c_k)
  $$

  其中，$P(c_k)$ 为地理位置 $c_k$ 的先验概率。

**解决的问题**：增强来自全球用户比例较小的国家或地区的粉丝对预测的贡献。

---

### 5. 先验概率的获取

**目的**：结合全球用户的地理分布，获取各地理位置的先验概率。

**实现思路**：

- 从全球用户分布数据中获取每个国家或地区的用户比例，形成先验概率表 `globalLocationDistribution`。
- 数据来源均为网络上的公开资料：[GitHub 开源项目](http://47.121.222.224:30013/#/) 和 GitHub 2021 年官方报告文档

**解决的问题**：在预测中考虑全球用户的地理分布，提高预测的准确性。

---

### 6. 权重的综合计算

**数学模型**：

- **单个用户的权重计算**：

  $$
  \text{weight}_i = T(t_i) \times W_{\text{social}}(n_i) \times I(c_k)
  $$

  其中，$T(t_i)$ 为时间衰减权重，$W_{\text{social}}(n_i)$ 为社交影响力权重，$I(c_k)$ 为信息量。

- **总权重的计算**：

  $$
  W(c_k) = \sum_{i \in c_k} \text{weight}_i
  $$

  其中，对所有地理位置为 $c_k$ 的用户，累加权重。

**解决的问题**：综合考虑多个因素，计算每个地理位置的综合权重。

---

### 7. 后验概率的计算

**目的**：基于综合权重，计算用户属于各地理位置的后验概率。

**数学模型**：

- **后验概率**：

  $$
  P(c_k | D) = \frac{W(c_k)}{\sum_j W(c_j)}
  $$

  其中，$D$ 为数据集，$W(c_k)$ 为地理位置 $c_k$ 的总权重。

**解决的问题**：得到用户属于各地理位置的概率分布。

---

### 8. 置信度的计算

**目的**：衡量预测结果的可靠性，置信度越高，预测结果越可信。

**数学模型**：

- **熵的计算**：

  $$
  H = -\sum_k P(c_k | D) \log P(c_k | D)
  $$

- **熵的归一化**：

  $$
  H_{\text{normalized}} = \frac{H}{\log N}
  $$

  其中，$N$ 为不同地理位置的数量。

- **置信度**：

  $$
  \text{Confidence} = 1 - H_{\text{normalized}}
  $$

- **置信度范围约束**：

  $$
  \text{Confidence} = \max(0, \min(1, \text{Confidence}))
  $$

**解决的问题**：提供预测结果的可靠性指标，方便评估和比较。

---

## 注意事项

- **地理位置标准化**：由于 glm 的不确定性，可能会导致构造返回的国家信息并不是标准 ISO
- **数据质量**：算法的准确性依赖于早期关注者 location 的完整性

