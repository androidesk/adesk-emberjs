## envriment 

- nodejs >= 0.12.x
- npm >= 2.10.x
- bower 


```
sudo mpm install ember-cli -g

```

### install m4

[m4](http://ftp.gnu.org/gnu/m4/)

```

cd envdependence
tar xvfz m4-latest.tar.gz
cd m4-1.4.17
./configure
make
make install

```

### install autoconf

[autoconf](http://ftp.gnu.org/gnu/autoconf/)
[autoconf](https://apps.ubuntu.com/cat/applications/saucy/autoconf/)

```
cd envdependence
tar xvfz autoconf-latest.tar.gz
cd autoconf-2.69
./configure
make
make install

```


### install automake

[automake](http://mirrors.kernel.org/gnu/automake/)


```
cd envdependence
tar xvfz automake-1.15.tar.gz
cd autoconf-1.15
./configure
make
make install

```

### install watchman

[watchman](https://facebook.github.io/watchman)

```

$ git clone https://github.com/facebook/watchman.git
$ cd watchman
$ ./autogen.sh
$ ./configure
$ make
$ sudo make install

``

if you cross build

```
sudo sh ./configure --host=i686-pc-linux-gnu

```