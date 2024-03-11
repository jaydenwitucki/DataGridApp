from marshmallow import Schema, fields

class ItemSchema(Schema):
    id = fields.Int(required=True)
    name = fields.Str(required=True)