# pylint: skip-file
from pymongo import MongoClient




class Database : 

    def __init__(self) -> None: 
        self.client = MongoClient('mongodb://127.0.0.1:27017/')
        self.db=self.client['admin']
    
    def upload_block(self,block):
        self.db.map.insert_one(block)

    def get_all_blocks_in_range(self,min_x:int,max_x:int,min_y:int,max_y:int)->list:
        print(f"(this.centre - this.likes/2) > {min_x} || (this.centre + this.likes/2) < {max_x}) && (this.centre - this.likes/2) > {min_y} || (this.centre + this.likes/2) < {max_y})")
        return list(self.db.map.find({"$where" :f"""(((this.center - this.likes/2) > {min_x} && (this.center - this.likes/2) < {max_x}) 
                                    || ((this.center +this.likes/2) > {min_x} && (this.center + this.likes/2) < {max_x}))
                                    && (((this.center - this.likes/2) > {min_y} 
                                    && (this.center - this.likes/2) < {max_y} ) || 
                                    (((this.center + this.likes/2) > {min_y} 
                                    && (this.center + this.likes/2) < {max_y})))"""}))

    def test_connection(self):
        self.db.drop_collection('missions')
        self.db.missions.insert_one({'name':'test0'})
        self.db.missions.insert_one({'name':'test1'})
        self.db.missions.insert_one({'name':'test2'})
        self.db.missions.insert_one({'name':'test3'})
        
        result = self.db.missions.find()

        for test in result :
            print(test)

    def test_get_all_blocks(self):
        self.db.drop_collection('map')
        self.db.map.insert_one({'text':'test0','likes':10,'center':0})
        self.db.map.insert_one({'text':'test1','likes':10,'center':0})
        self.db.map.insert_one({'text':'test2','likes':10,'center':0})
        self.db.map.insert_one({'text':'test3','likes':10,'center':0})
        
        result = self.db.map.find()

        for test in result :
            print(test)


database = Database()
database.test_get_all_blocks()

print(database.get_all_blocks_in_range(0,20,0,30))

