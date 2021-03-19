# Syntax issues

## File reference

```
# Ideographic Description Sequences (IDS) for CJK Unified Ideographs
# URL: https://babelstone.co.uk/CJK/IDS.TXT
# Maintained by: Andrew West (魏安) <babelstone@gmail.com>
# Date: 2021-03-17
# Unicode Version: 13.0 (92,856 entries)
```

## Issues

```
# Missing leading ^
U+38CA	㣊	^⿱攵彡$(K)	⿱夂彡$(Z)
# should be:
U+38CA	㣊	^⿱攵彡$(K)	^⿱夂彡$(Z)
```

```
# Missing trailing $
U+22A57	𢩗	^⿰𡰥⿱户户$(G)	^⿰𡰥⿱戶戶(Z)
# should be:
U+22A57	𢩗	^⿰𡰥⿱户户$(G)	^⿰𡰥⿱戶戶$(Z)
```

```
# Not a valid comment (should start with *)
U+22B33	𢬳	^⿰扌秃$(G)	^⿰扌禿$(T)	(V?)
# should be:
U+22B33	𢬳	^⿰扌秃$(G)	^⿰扌禿$(T)	*(V?)
```

```
# Extraneous tabulation
U+2A941	𪥁	^⿱大乛$(K)		^⿱大𠃍$(Z)
# should be:
U+2A941	𪥁	^⿱大乛$(K)	^⿱大𠃍$(Z)
```

```
# Extraneous space (between IDS sequence and source)
U+2D0A8	𭂨	^⿲冫虫𮫙$(K)	^⿰冫螎$ (Z)
# should be:
U+2D0A8	𭂨	^⿲冫虫𮫙$(K)	^⿰冫螎$(Z)
```

```
# Missing both leading ^ and trailing $
U+2E49B	𮒛	^⿱艹𠅀$(J)	⿱蓻云(X)
# should be:
U+2E49B	𮒛	^⿱艹𠅀$(J)	^⿱蓻云$(X)
```
