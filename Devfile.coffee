prova = bin 'prova'

all 'test'

task 'test', 'lib/**/*.js', 'test/**/*.js', 'test/**/*.css', ->
    debug 'Running tests'
    prova 'test/node.js -V -g article'
