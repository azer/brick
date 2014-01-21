prova = bin 'prova'

task 'test', ->
    prova 'test/node.js -V'
