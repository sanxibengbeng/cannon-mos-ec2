const { filterHit } = require("../../../lambda/logic/canhit");
//var mosqueto = [{"x":-3,"y":3,"id":"vCh5E6PM8PFKJu43iwYTsf"},{"x":-3,"y":3,"id":"gTvQ3yB8eGnTj4PW6TNfnu"},{"x":-4,"y":1,"id":"kt4zWnZooAMV6qnBMzzzbC"},{"x":0,"y":-2,"id":"sB6xp14jcaxxBuzj4k46V9"},{"x":1,"y":-2,"id":"cqmapqPHHm92mLJLJzNnNq"},{"x":-2,"y":3,"id":"6g3CKjrFfXCVVbAiRV3ZuE"},{"x":-4,"y":1,"id":"j6aRU4NNg6unkd9HZ5MyNt"},{"x":-3,"y":1,"id":"msXYPmD2tiwrDaXATSAq2R"},{"x":-3,"y":-2,"id":"uFhccU8vVHYSzBGYFc1Bji"},{"x":-3,"y":-3,"id":"uFpCLwpM5LtFrpoP94Vb54"},{"x":4,"y":2,"id":"kvyTp4kBpb1Cjswafu1PFE"},{"x":4,"y":2,"id":"dcwbTLQvcAxm4KEpMUqvUs"},{"x":2,"y":-1,"id":"v8Zuxw5aUx4DWo3pWB5fus"}]
var mosqueto = [{"x":-4,"y":1,"id":"kt4zWnZooAMV6qnBMzzzbC"},{"x":0,"y":-2,"id":"sB6xp14jcaxxBuzj4k46V9"}]
var hitInfo = {"hit":[],"player":"1","origin":{"x":5,"y":-4},"angle":153.4381103515625}
test('filter hit', () => {
    expect(filterHit(mosqueto, hitInfo)).toStrictEqual({"hit": ["kt4zWnZooAMV6qnBMzzzbC", "sB6xp14jcaxxBuzj4k46V9"], "targets": [{"id": "kt4zWnZooAMV6qnBMzzzbC", "x": -4, "y": 1}]});
});