# Kraft Kord

### Intelligent Chord Recommendation and Harmonic Navigation Engine

## Overview

Kraft Kord is an intelligent chord recommendation system designed to assist music producers, composers, and songwriters in navigating harmonic space with precision, taste, and creative flexibility.

The core goal of Kraft Kord is **not to generate random chords**, but to **model harmonic decision-making** in a way that reflects musical theory, stylistic context, and human taste. The system aims to recommend chord progressions and voicings that are musically coherent, stylistically aligned, and adaptable to user intent.

This project sits at the intersection of **music theory, algorithmic decision-making, and software engineering**, with future extensibility toward AI-assisted composition tools.

---

## Problem Statement

Modern music production tools offer immense flexibility but place a high cognitive load on creators when it comes to harmonic choices:

* Choosing the *next chord* that sounds right
* Maintaining stylistic consistency across a progression
* Managing voicings, inversions, and register
* Avoiding repetitive or mechanically generated progressions

Kraft Kord addresses this by treating chord selection as a **stateful optimization problem** rather than a static lookup or random generation task.

---

## Core Idea

At its heart, Kraft Kord models music as a **sequence of harmonic states**.

Each chord represents a state influenced by:

* Scale or mode context
* Previous chord(s)
* Voice leading constraints
* Harmonic tension and resolution
* User-defined taste and stylistic preferences

The system evaluates **possible next chords** and assigns them scores based on musical and contextual criteria, recommending the most suitable candidates rather than a single deterministic answer.

---

## Conceptual Model

### Harmonic States

A harmonic state may include:

* Root note
* Chord quality (major, minor, diminished, extended, altered)
* Inversion and voicing
* Scale or mode context (Ionian, Dorian, Phrygian, etc.)
* Register and density constraints

### Transitions

Transitions between states are governed by:

* Music theory rules (functional harmony, modal interchange, tension-resolution)
* Voice-leading cost
* Stylistic heuristics
* User constraints (mood, genre, complexity)

Each transition carries a **cost or score**, allowing the system to reason about musical continuity and aesthetic quality.

---

## Dynamic Programming Perspective

Chord progression generation is treated as a **multi-step optimization problem**:

* Each step represents choosing the next chord
* The system maintains the best possible outcomes up to that step
* Poor harmonic paths are pruned early
* Optimal or high-quality progressions are preserved

This approach enables:

* Predictable musical coherence
* Efficient exploration of harmonic possibilities
* Fine-grained control over progression length and structure

---

## Taste and Style Modeling

Kraft Kord introduces the concept of a **Taste Score**, which influences recommendations based on:

* Preferred chord movements
* Avoidance of clichés or overused patterns
* Genre-specific tendencies
* User feedback over time (future scope)

Taste is treated as a tunable layer on top of harmonic correctness, not a replacement for theory.

---

## System Scope (Current and Planned)

### Phase 1: Deterministic Engine

* Explicit scale and mode definitions
* Predefined chord sets per scale
* Rule-based transition scoring
* Deterministic DP-based progression generation

### Phase 2: Expressive Control

* Voicing and inversion awareness
* Register and density constraints
* User-defined harmonic preferences

### Phase 3: Learning Layer (Future)

* Adaptive taste modeling
* Style profiling
* Feedback-driven refinement
* Integration with MIDI generation and DAWs

---

## Design Philosophy

* **Correctness before cleverness**
* **Explainable decisions over black-box outputs**
* **Musical intuition encoded as software abstractions**
* **Modular architecture for future AI integration**

Kraft Kord is intentionally built as a system that can be reasoned about, debugged, and extended—mirroring how skilled musicians think about harmony.

---

## Why This Matters

This project demonstrates:

* Deep understanding of state-based optimization
* Application of algorithmic thinking to creative domains
* Ability to translate domain knowledge (music theory) into software systems
* Foundations relevant to recommendation systems, search, and decision engines

Kraft Kord is not just a music tool—it is a **thinking system for harmony**.

---

## Status

This project is under active exploration and iterative design. Early implementations prioritize clarity of states and transitions over model complexity.