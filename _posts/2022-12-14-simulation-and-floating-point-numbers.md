---
title: Simulation and Floating Point Numbers
date: 2022-12-14 15:25:00 -0500
categories: [Random]
tags: [blog, tech, random]
math: true
---

# Intro

I probably won't do this often, but I expect I'll learn some interesting things and thought this would be a good place to document it.

> I know little about what I'm about to present as fact. The following information is likely not the full picture.
{: .prompt-warning }

As I'm sitting here procrastination studying for my `Numerical Computing` final, I'm wondering what language I should begin prototyping in. This is somewhat determined by what features I expect needing in this game. 

Here's my thinking:
- I know I want to draw to a screen with images, so this shouldn't be a console game. 
- I want to be able to prototype this fast, so I should make it a Mac/Windows/Linux game. 
- My development will likely be spread across these three platforms, so I should pick a language that works relatively the same independent of platform.

This leads me to Java. Java is special because the code sits in a virtual environment (the JVM, Java Virtual Machine) that then interacts with the host operating system. The reason it does this is so that code doesn't need to be ported to every platform; only the JVM needs to be platform-specific. 
This comes with the caveat that different JVMs do slightly different things. These slight differences can compound such that the exact same code on two different machines may produce very different results, especially around floating point numbers.
But, to my knowledge, the JVMs are generally pretty good at doing the same thing. This is almost a non-issue for me if I pick Java (although may create a nasty bug down the road). 

But, I haven't ever had much fun working with Java's drawing libraries, and I'm not crazy enough to jump into OpenGL. I'd much rather use C++, Lua, and [Raylib](https://www.raylib.com/).
With this in mind, and my Numerical Computing test looming, let's talk about floating point numbers and why different computers would get different answers to the same problem.

# IEEE 754 Floating-Point Arithmetic

The Institute of Electrical and Electronics Engineers (IEEE) have published many standards for how computers should represent floating point numbers -- real, non-integer numbers like `0.5` or `17.38`. The most recent iteration was in 2019 called `IEEE 754-2019`. 
There are two common formats: a 32-bit `float32` usually shortened to `float` and a 64-bit format usually named `double`, short for `double float` but also known as `float64`. 

## Binary

The challenge with representing floating point numbers is that, ultimately, they need to be represented as a sequence of zeroes and ones. How do we do this? Let's take inspiration from a binary format, and to best understand binary let's first revisit the decimal number system. Let's count.
$$ 01, 02, 03, \cdots, 09, 10 $$. Notice how we incremented the value in the ones-place value/first place value until we ran out of digits. Once we tried to increment $$9$$, we reset the first place value and moved to the second place value, where we incremented the value by one. We can continue this process.
$$ 10, 11, \cdots, 19, 20 $$. Again, we ran out of digits in the first place so we incremented the second place and reset the first place. We are counting in a base-10 system. It's called a base-10 system because there are ten values for every digit, the numbers 0-9.

Let's count in binary. It's almost the same, but now $$1$$ is our last value.
$$ 00, 01, 10 $$. This is a base-2 system, because we only have two values for every digit: $$0$$ and $$1$$. Let's keep counting. $$ 0010, 0011, 0100, 0101, 0110, 0111, 1000 $$. Note that, just like in base-10, we can freely add leading zeroes. It doesn't change the value of the number and doesn't affect the value of the digits before it if placed to the left hand side. The same isn't true if we placed zeroes on the right; that would change the value of later digits. Note that, when using binary, they're no longer technically digits; they're now bits (`bi-` meaning two, `digit` comes from _digiti_ meaning fingers).

How do we convert back and forth? The 'base-2' gives us a hint. In base-10, the difference between $$70$$ and $$7$$ is that the 7 appears in a different place. They both have the same digits, but the 7 in $$70$$ is worth more. Specifically, 10x more, because we are using a base-10 system.

The same is true in binary. The 1 in $$100$$ should be worth 2x as much as the 1 in $$010$$ because it is one place value up. Looking at our counting, we see $$100 = 4$$ and $$010 = 2$$, which we can validate as $$ 4 = 2(2) $$. 

To translate simply, we can use the following procedure:

$$
    2^n(b_n) + 2^{n-1}(b_{n-1}) + \cdots 2^{2}(b_2) + 2^{1}(b_1) + 2^{0}(b_0)
$$

Where $$b_n$$ is the value of the digit $$n$$ places to the left. 
We are multiplying the value in every place by the base raised to the power of the location of the value. It's not easy to explain, but hopefully some examples will show what we're doing here.
Let's use this to translate $$100$$ from binary.

$$
    2^2(1) + 2^1(0) + 2^0(0) = 4(1) + 2(0) + 1(0) = 4
$$

How about something more complicated now? $$011011$$:

$$
\begin{eqnarray}
    && \phantom{ = 0} 2^5(0) + 2^4(1) + 2^3(1) + 2^2(0) + 2^1(1) + 2^0(1) \\
    && = 32(0) + 16(1) + 8(1) + 4(0) + 2(1) + 1(1) \\
    && = 16 + 8 + 2 + 1 = 27
\end{eqnarray}
$$

Note that we got a value in the base-10 system. That's because we are using the basis of the base-10 system. We could just as easily translate binary back into binary (or a polynomial equation, although this now gets into linear algebra). We can also perform this translation on a base-10 number, like $$193$$:

$$
    10^2(1) + 10^1(9) + 10^0(3) = 100(1) + 10(9) + 1(3) = 100 + 90 + 3 = 193
$$

We got the same thing as we started with.

## Floating point

Now we're ready to talk about floating point numbers. Why don't we continue this pattern? We can simply extend our place values to the right, just like we do with base-10 numbers. Let's try representing $$ 0.5 $$ with this system:

$$
    0.5 = \frac{1}{2} = 2^{-1}
$$

So we would need a binary number that has zeros everywhere _except_ the place value that corresponds to $$2^{-1}$$, where we should have a 1 to select that value. We'll represent this number as $$0.1$$ in binary. We can convert this back:

$$
    2^0(0) + 2^{-1}(1) = 1(0) + 0.5(1) = 0.5
$$

That works! Now, let's represent $$0.3$$ in binary.

$$
    0.3 = 0.25 + 0.05
$$

Not sure how to represent 0.05, but we can represent 0.25 as $$2^{-2}$$! This is when we need to worry about repeating decimals. This is a problem in base-10. How do we represent $$\frac{1}{3}$$? $$0.333333\cdots$$. That's not an exact representation. 
Now, if we had a base-3 system, this would be easy! $$\frac{1}{3} = 3^{-1} = 0.1_{3}$$.
But we can't represent this exactly in base-10. We're seeing the same problem in base-2. We can't exactly represent $$0.3$$, an easy problem in base-10 but not for a computer.
Let's ask the computer how it would solve this:

```python
print( 0.1 + 0.2 ) # Output: 0.30000000000000004
```

This right here is the manifestation of that repeating digit.

Let's look at the `IEEE 754 float32` standard. It states that 32 bit floats should reserve one bit as a sign bit, whether the number is positive or negative. Then, 8 exponent bits. We'll get to why that's important. Then, 23 fraction bits, also referred to as the `mantissa`. This will encode the digits of the number.

The exponent works to zoom the number in and out on the number line. The easiest way of seeing why this is important is with an example. Take $$332,041,393,326,771,929,088$$.
This is a huge number, and won't fit within a typical 64-bit number! The largest number we can store in a 64-bit number is $$2^64 - 1 = 18,446,744,073,709,551,615$$.
But our number can be stored exactly with a `float`. That's because our huge number, $$332,041,393,326,771,929,088$$ is actually $$2^{68} + 2^{65}$$. This is where the exponent is useful. We can store this number as $$(2^3 + 2^0) * 2^{65}$$. This lets us store numbers that would otherwise be outside of our range.

This also works for very small numbers. $$0.000000961124897003173828125$$? Oh that's actually $$(2^7 + 2^0) * 2^{-27}$$.

This is the idea behind floating point numbers. The formula for the value of a `float`-encoded number is as follows:

$$
    (-1)^{b_{31}} * 2^{(b_{30}b_{29}\cdots b_{23})_2 - 127} * (1.b_{22}b_{21}\cdots b_{0})_2
$$

Instead of using the bits, lets write our the names for these elements:

$$
    (-1)^{\text{Sign}} * 2^{\text{Exponent} - 127} * (1 + \text{Mantissa})
$$

We use this $$+1$$ trick in the mantissa part to encode a free bit of information. We can safely assume that there's always _at least one 1_ in a number. Otherwise, it's zero!

_To be continued..._
