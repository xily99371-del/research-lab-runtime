#!/usr/bin/env python3
"""Bayesian conjugate inference and gradient-descent stability lab.
Run: python 01_bayes_and_optimization.py
Dependencies: numpy, matplotlib
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def gaussian_posterior(y, prior_mean=0.0, prior_var=4.0, noise_var=1.0):
    y = np.asarray(y, dtype=float)
    precision = 1.0 / prior_var + len(y) / noise_var
    variance = 1.0 / precision
    mean = variance * (prior_mean / prior_var + y.sum() / noise_var)
    return mean, variance

def gradient_descent_quadratic(y, prior_mean, prior_var, noise_var, lr, steps=500):
    y = np.asarray(y, dtype=float)
    theta = float(prior_mean)
    history = []
    for _ in range(steps):
        grad = (theta - prior_mean) / prior_var + np.sum(theta - y) / noise_var
        theta -= lr * grad
        history.append(theta)
    return theta, np.asarray(history)

def main():
    y = np.array([3.0])
    mu, var = gaussian_posterior(y)
    gd, history = gradient_descent_quadratic(y, 0.0, 4.0, 1.0, lr=0.2)
    print("BAYESIAN POSTERIOR")
    print(f"posterior_mean={mu:.6f}  posterior_variance={var:.6f}")
    print("OPTIMIZATION")
    print(f"gradient_descent_estimate={gd:.6f}  abs_error={abs(gd-mu):.3e}")
    print("CHECKS")
    print(f"prior_precision_plus_data_precision={1/4+len(y):.6f}")
    print("Expected: posterior_mean=2.400000, posterior_variance=0.800000")
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(history, label="gradient descent")
    ax.axhline(mu, linestyle="--", label="MAP / posterior mean")
    ax.set(xlabel="iteration", ylabel="parameter", title="Conjugate posterior and optimization")
    ax.legend()
    fig.tight_layout()
    fig.savefig("01_bayes_optimization.png", dpi=160)
    print("Saved: 01_bayes_optimization.png")

if __name__ == "__main__":
    main()
