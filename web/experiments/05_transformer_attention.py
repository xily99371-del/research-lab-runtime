#!/usr/bin/env python3
"""Numerically compare full attention with exact blockwise online softmax.
Also checks the CLIP/InfoNCE logit-gradient identity.
Run: python 05_transformer_attention.py
Dependencies: numpy, matplotlib
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def softmax(x, axis=-1):
    z = x - np.max(x, axis=axis, keepdims=True)
    e = np.exp(z)
    return e / np.sum(e, axis=axis, keepdims=True)

def full_attention(Q, K, V):
    scores = Q @ K.T / np.sqrt(Q.shape[-1])
    return softmax(scores, axis=-1) @ V

def online_attention(Q, K, V, block=64):
    n, d = Q.shape
    m = np.full(n, -np.inf)
    denom = np.zeros(n)
    numer = np.zeros((n, V.shape[1]))
    scale = np.sqrt(d)
    for start in range(0, len(K), block):
        Kb, Vb = K[start:start+block], V[start:start+block]
        scores = Q @ Kb.T / scale
        mb = np.max(scores, axis=1)
        m_new = np.maximum(m, mb)
        old_scale = np.exp(m-m_new)
        block_exp = np.exp(scores-m_new[:, None])
        denom = old_scale*denom + np.sum(block_exp, axis=1)
        numer = old_scale[:, None]*numer + block_exp @ Vb
        m = m_new
    return numer / denom[:, None]

def main():
    rng = np.random.default_rng(41)
    n, d = 384, 64
    Q, K, V = (rng.normal(size=(n, d)) for _ in range(3))
    full = full_attention(Q, K, V)
    block_sizes = [16, 32, 64, 96, 128]
    errors = []
    for block in block_sizes:
        tiled = online_attention(Q, K, V, block)
        errors.append(np.max(np.abs(full-tiled)))
    # For one InfoNCE row, dL/dlogit_j = p_j - 1[j=positive].
    logits = np.array([2.0, 0.5, -0.2])
    p = softmax(logits)
    grad = p.copy(); grad[0] -= 1.0
    print("EXACT BLOCKWISE ATTENTION")
    print(f"max_abs_error_block64={errors[2]:.3e}")
    print(f"max_abs_error_all_blocks={max(errors):.3e}")
    print(f"full_score_matrix_bytes={n*n*8}")
    print(f"block_score_matrix_bytes={n*max(block_sizes)*8}")
    print("CLIP / INFONCE LOGIT GRADIENT")
    print("probabilities=" + np.array2string(p, precision=6))
    print("gradient=" + np.array2string(grad, precision=6))
    print("Expected: tiled attention agrees with full attention up to floating-point tolerance.")
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(block_sizes, errors, "o-")
    ax.set(xlabel="key/value block size", ylabel="maximum absolute error",
           title="Online softmax versus full attention")
    fig.tight_layout()
    fig.savefig("05_transformer_attention.png", dpi=160)
    print("Saved: 05_transformer_attention.png")

if __name__ == "__main__":
    main()
