# pylint: skip-file

from pymongo import MongoClient

from bson.objectid import ObjectId

# Idea for like scale by the number of growth for all in a certain direction so that the proportions stay the same


class Database:

    def __init__(self) -> None:
        self.client = MongoClient('mongodb://127.0.0.1:27017/', fsync=True)
        self.db = self.client['admin']
        self.default_size = 10

    def upload_block(self, post):
   

        min_x = post['center_x'] - self.default_size/2
        min_y = post['center_y'] - self.default_size/2
        max_x = post['center_x'] + self.default_size/2
        max_y = post['center_y'] + self.default_size/2

        collisions = list(self.db.map.find({"$where": f"""(((this.center_x - {self.default_size}/2 - this.likes/2) > {min_x} && (this.center_x - {self.default_size}/2 - this.likes/2) < {max_x}) 
                                    || ((this.center_x  + {self.default_size}/2 + this.likes/2) > {min_x} && (this.center_x + {self.default_size}/2 + this.likes/2) < {max_x}))
                                    && (((this.center_y -{self.default_size}/2 - this.likes/2) > {min_y} && (this.center_y - {self.default_size}/2 - this.likes/2) < {max_y} ) || 
                                    (((this.center_y + {self.default_size}/2 + this.likes/2) > {min_y} && (this.center_y + {self.default_size}/2 + this.likes/2) < {max_y})))
                                    || (((this.center_y > {min_y}) && (this.center_y < {max_y})) && ((this.center_x > {min_x}) && (this.center_x < {max_x})))"""}))

        if len(collisions) == 0:
            id= self.db.map.insert_one(post)
            return str(id.inserted_id) 

        print("spot taken")
        return "False"

    def get_all_blocks_in_range(self, min_x: int, max_x: int, min_y: int, max_y: int):

        return list(self.db.map.find({"$where": f"""(((this.center_x - {self.default_size}/2 - this.likes/2) > {min_x} && (this.center_x - {self.default_size}/2 - this.likes/2) < {max_x}) 
                                    || ((this.center_x  + {self.default_size}/2 + this.likes/2) > {min_x} && (this.center_x + {self.default_size}/2 + this.likes/2) < {max_x}))
                                    && (((this.center_y -{self.default_size}/2 - this.likes/2) > {min_y} && (this.center_y - {self.default_size}/2 - this.likes/2) < {max_y} ) || 
                                    (((this.center_y + {self.default_size}/2 + this.likes/2) > {min_y} && (this.center_y + {self.default_size}/2 + this.likes/2) < {max_y})))
                                    || (((this.center_y > {min_y}) && (this.center_y < {max_y})) && ((this.center_x > {min_x}) && (this.center_x < {max_x})))"""}))

    def add_like(self, _id) -> bool:
        # self.db.missions.update_many(
        #   {"$where": f"(this._id != {__id}) && (this.center_x > {center_x})"}, {"$inc": {'center_x': 1}})
        #self.db.missions.update_many(
        #    {"$where": f"(this._id != {__id}) && (this.center_y > {center_y})"}, {"$inc": {'center_y': 1}})
        return self.db.map.update_one(
            {"_id": ObjectId(_id)}, 
            {"$inc": {'likes': 1}}
        ).modified_count == 1

    def remove_like(self, _id) -> bool:
       # self.db.missions.update_many(
       #     {"$where": f"(this._id != {__id}) && (this.center_x > {center_x})"}, {"$inc": {'center_x': -1}})
       # self.db.missions.update_many(
       #     {"$where": f"(this._id != {__id}) && (this.center_y > {center_y})"}, {"$inc": {'center_y': -1}})
        return str(self.db.map.update_one({"_id": ObjectId(_id)}, {"likes" :{"$gt:0"}}, {"$inc": {'likes': -1}}).modified_count == 1)
    
    def remove_by_id(self, _id) -> bool:
        return str(self.db.map.delete_one({"_id": ObjectId(_id)}))

    def find_text(self, text) -> list:
        return list(self.db.map.find({"$where": f"this.text.includes('{text}')"}))

    def test_get_all_blocks(self):
        self.db.drop_collection('map')
        self.upload_block({'text': 'test0', 'likes': 0, 'center_x': 0, 'center_y': 0})
        self.upload_block({'text': 'test1', 'likes': 0, 'center_x': 5, 'center_y': 5})
        self.upload_block({'text': 'test2', 'likes': 0, 'center_x': 10, 'center_y': 0})
        self.upload_block({'text': 'test3', 'likes': 0, 'center_x': 0, 'center_y': 0})

        result = self.db.map.find()

        for test in result:
            print(test)

    def serialize_list(self,result:list):
        for test in result:
            test['_id'] = str(test['_id'])
        return result

# database = Database()
# database.remove_by_id("62085d8fedeb6235df79ed3f")