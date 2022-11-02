#!/bin/bash

# Script adapted from Calvin Rodo: 
# https://github.com/CalvinRodo/BattleSnakeEnvPython/blob/main/test_perf.sh

# define an empty array
declare -a arr

# a for loop that runs the program 10 times
for i in {1..100}
do
  echo "Running test $i"
  battlesnake play -W 11 -H 11 --name 'TypeScript Starter Project' --url http://localhost:8000 -g solo --viewmap --output out.log  > /dev/null 2>&1
  turn_len=$(wc -l < out.log)
  turn_len=$(( turn_len - 2))
  arr+=("$turn_len")
done

# print the array
echo "Turns per game: ${arr[*]}"

total=0
sum=0
for i in "${arr[@]}"
do
    ((sum += i))
    ((total++))
done

max=0
for i in "${arr[@]}"
do 
  if ((i > max))
  then
    max=$i
  fi
done 

min=99999999
for i in "${arr[@]}"
do 
  if ((i < min))
  then
    min=$i
  fi
done


echo "Average turn length $((sum/total))"
echo "Max turn length $max"
echo "Min turn length $min"

exit