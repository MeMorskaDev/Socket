var dbNames = db.getMongo().getDBNames();
print('dbNames '+dbNames);

for(var i in dbNames){
    if(dbNames[i] !== 'local' && dbNames[i] !== 'admin'){
        var db=db.getMongo().getDB(dbNames[i]);
        print('Droping Database '+ dbNames[i]);
        db.dropDatabase();
    }
}