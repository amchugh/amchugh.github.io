---
title: Simulation-based Gaming
date: 2022-12-18 04:46:00 -0500
categories: [Design]
tags: [blog, tech, random]
---

> It is currently 4:47 A.M. and I'm waiting for my flight home for winter break. I haven't slept. This will be rough.
{: .prompt-warning }

# Test-Driven Development

In my time at Amazon and Caffeine, test-driven development dominated the way I wrote code.
Every code review I submitted should be a measureable yet small change followed by sufficient code to test it.
The testing code should accomplish two things:
1. If the function is ever changed such that it gives different output, the tests will fail
2. One can read the tetsts and understand how the thing should be interacted with.

Allow me to give an example. Say you're creating a save and load feature. A `unit test` would need to create a player, modify its data, save the player's progress, load the player's progress, and ensure it is identical to before.

```c++
struct PlayerData {
    int health;
    int level;
    void Save(const char*);
    void Load(const char*);
}
```
{: file="playerdata.hpp"}

```c++
const int EXAMPLE_HEALTH = 1337;
const int EXAMPLE_LEVEL = 7;
bool test_PlayerSaveLoad() {
    PlayerData loaded, set;
    set.health = EXAMPLE_HEALTH;
    set.level = EXAMPLE_LEVEL;
    set.Save("/tst/rsc/ExampleSaveData.dat");
    loaded.Load("/tst/rsc/ExampleSaveData.dat");
    assertEquals(loaded.health, EXAMPLE_HEALTH);
    assertEquals(loaded.level, EXAMPLE_LEVEL);
}
```
{: file="playerdata_test.cpp"}

I want to be able to do this for my game. This will help me keep the game mostly bug free. I also prefer the test driven development style. The style has you write your unit tests _first_ so that you know the expected behaviour of the unit you are about to write before it is written. I want that. How do I structure the game such that I can do this?

# Simulation

Imagine the game is already written and, at its core, it takes the form of one big entity, like a black box. We don't care how it figures stuff out, we just chart what it tells us. 
The black box is given the inputs of every player at every frame and updates its internal state.
So all I would be responsible for is fetching player input, giving it to the black box, and then peek inside the black box every frame to draw stuff where it belongs. 

This would make testing easy! I capture the state of a black-box, or a game simulation instance, load that state, and then run the simulation with pre-written player input.
Once the simulation is done, I peer under the hood and ensure the values I see are the ones I expect!

Another example.

```c++
struct Simulation {
    Player player1;
    float simulationSpeed;
    void updateSimulation(PlayerInput& player1Input);
}
struct Player {
    Vector2 pos;
    int speed;
}
struct PlayerInput {
    bool doMoveRight;
}
```
{: file="simulation.hpp"}

```c++
void test_SimulatePlayerWalkingLeft() {
    Simulation s;
    // Simulate one second of time for every update
    s.simulationSpeed = 1; 

    Player p1;
    // Player starts at the origin and moves 5 units per second
    p1.pos = {0, 0};
    p1.speed = 5; 
    s.player1 = p1;

    // Simulate the player moving to the right
    PlayerInput input = {true};
    s.updateSimulation(input);

    // Player should have moved five units to the right
    assertEquals(s.player1.pos.x, 5);
    // And no units up or down
    assertEquals(s.player1.pos.y, 0);
}
```
{: file="simulation_test.cpp"}

So the entire game will be a big simulation that I can write at my own pace, and then I will write a few wrappers ontop of it: something to get input, something to draw to the screen, maybe something to handle network connections?

Should be fun! Short post for today because I am very tired.
