---
title: Simplified DES
datet: 2023-1-19 21:15:00 -0800
categories: [Random]
---

# DES

The **Data Encryption Standard** isn't the standard anymore. Today, that's AES, the **Advanced Encryption Standard**. Why? Because DES is a broken algorithm; evildoers could reasonably crack it. It was secure for about 20 years before we advanced enough to find a secret DES key using a known-plaintext attack. This means, if an educated person could get access to a DES-encrypter, they could discover the hidden key by looking at the outputs. It would take time, but it could be done.

But DES is still worth learning. Some machines haven't been upgraded to AES -- they still use DES. Some engineers take use of any hardware accelerated DES circuits and perform a variant called **Triple-DES**. DES was the inspiration to AES, and to understand encryption today one would need to understand AES. AES is the gold standard. In fact, if you're viewing this on `https://amchugh.github.io/`, you're most likely using AES when communicating with the hosting server. I know I am:

![Chrome Debug panel showing using AES_128_GCM](/assets/using-aes.png)

On the right is the chrome debug panel. You can see this for yourself if you're on desktop chrome (or Chromium):
1. Click the Three Dots in the upper right
2. More Tools > Developer Tools
3. Across the top of the window that pops out: Security
4. In the overview, there shoud be a text blurb about what version of TLS you are using and what cipher (AES-128, probably).

This blog post is about Simplified DES -- a version of DES made simpler (and worse) for the purpose of education. Full DES takes too long to break. If you want to break it yourself as an individual with commercial computers, you need a slightly simpler algorithm to break it in reasonable time. Plus, it makes it easier to code and understand! 

Speaking of breaking: presumably, a cipher is *secure* if you can show someone the text going in, the text going out, and the algorithm you are using without showing them the *secret* key, and they're unable to predict how different text going in will come out. This algorithm, as we mentioned above, is broken. You *can* tell. 

# Simplified DES

In the future, I may expand this section to better explain the algorithm. I'll give the simple version for now.

The algorithm takes in one 8-bit value or `plaintext` and one 10-bit `key`. It spits out a new 8-bit value called `ciphertext`. The `key` is what you keep secret. The `plaintext` also needs to be kept secure -- as in no one other than the sender and recipient may know the `plaintext`. Everyone may see the `ciphertext`.

# Resources

## Example Output

It would have helped me tremendously seeing some example inputs and outputs of Simplified DES while I was developing my algorithm. Especially because I had a bug exclusive to my `decode` function which resulted many hours spent debugging the _correctly working_ `encode` function.

I've included a magic button that will copy to your clipboard code in `C` for a key and array of outputs for all possible 256 inputs in order 0-255. Hopefully this can be used as a unit-test of sorts. The code looks as follows but is filled in fully:

> Ensure that you use the same tables and permutations for your algorithm in the `Code` section!
{: .prompt-warning }

```c
uint16_t key = 0b1000001100;
uint8_t outputs[256] = {0x9d, 0xd2, 0x56, /* ... */ 0xb4};
```
{: file="clipboard" }

<a id="copy">**Click here to copy the code to your clipboard**</a>

[Click here for a link to raw text](/assets/tests.c)

<script src="/assets/js/copydes.js"></script>

## Code

Here is the code for my Simplified-DES algorithm. I originally felt weird about posting this as I knew it was going to be a class assignment, but while researching it I found working code in Java at [GeeksForGeeks](https://www.geeksforgeeks.org/simplified-data-encryption-standard-set-2/) so I don't feel bad; at worst I'm adding it in a new language. There's no way I'm as popular as GeeksForGeeks.

```c++
{% include simplified-des.cpp %}
```
{: file="simplified-des.cpp" }
