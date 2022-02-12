# pylint: skip-file
from pymongo import MongoClient

##Idea for like scale by the number of growth for all in a certain direction so that the proportions stay the same



class Database : 

    def __init__(self) -> None: 
        self.client = MongoClient('mongodb://127.0.0.1:27017/')
        self.db=self.client['admin']
    
    def upload_block(self,block):
        self.db.map.insert_one(block)

    def get_all_blocks_in_range(self,min_x:int,max_x:int,min_y:int,max_y:int)->list:
        return list(self.db.map.find({"$where" :f"""(((this.center_x - this.likes/2) > {min_x} && (this.center _x- this.likes/2) < {max_x}) 
                                    || ((this.center_y +this.likes/2) > {min_x} && (this.center_y + this.likes/2) < {max_x}))
                                    && (((this.center_y - this.likes/2) > {min_y} && (this.center_y - this.likes/2) < {max_y} ) || 
                                    (((this.center_y + this.likes/2) > {min_y} && (this.center_y + this.likes/2) < {max_y})))"""}))
    
    def add_like(self,__id,center_x,center_y)->bool:
        self.db.missions.update_many({"$where" :f"(this.__id != {__id}) && (this.center_x > {center_x})"},{"$inc":{'center_x':1}})
        self.db.missions.update_many({"$where" :f"(this.__id != {__id}) && (this.center_y > {center_y})"},{"$inc":{'center_y':1}})
        return  self.db.missions.update_one({"_id":id},{"$inc":{'likes':1,'center_x':1,'center_y':1}}).modified_count == 1

        


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
        self.db.map.insert_one({'text':'test1','likes':10,'center':5})
        self.db.map.insert_one({'text':'test2','likes':10,'center':10})
        self.db.map.insert_one({'text':'test3','likes':10,'center':34})
        
        result = self.db.map.find()

        for test in result :
            print(test)


database = Database()
database.test_get_all_blocks()

