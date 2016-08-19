#!/bin/bash
for (( j = 0; j < 10000; j++ ));
    do
      LA=$((i % 180))
      LN=$((j % 180))
      ENTRY="login=spamking&lat=$LA&lng=$LN"
      echo $DATA
      curl --data $ENTRY https://powerful-tor-64243.herokuapp.com/sendLocation
done
