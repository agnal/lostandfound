const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Item = require('../models/Item');
// const User = require('../../models/User'); 
const itemController = require('../controllers/mainController');

describe('Item Controller Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ✅ CREATE ITEM
  describe('createItem', () => {
    it('should create an item successfully', async () => {
      const req = {
        body: {
          title: 'Phone',
          description: 'Black iPhone',
          deadline: '2025-12-31',
        },
        file: { filename: 'image.jpg' },
        user: { _id: new mongoose.Types.ObjectId() },
      };

      const savedItem = {
        ...req.body,
        image: `/uploads/${req.file.filename}`,
        user_id: req.user._id,
      };

      sinon.stub(Item.prototype, 'save').resolves(savedItem);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await itemController.createItem(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('item', savedItem))).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        body: { title: 'X' },
        user: { _id: new mongoose.Types.ObjectId() },
      };

      sinon.stub(Item.prototype, 'save').throws(new Error('DB Error'));

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await itemController.createItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  // ✅ GET ALL ITEMS (USER)
  describe('getItems', () => {
    it('should return all items for user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockItems = [{ title: 'Book', user_id: userId }];

      const req = { user: { _id: userId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const sortStub = sinon.stub().resolves(mockItems);
      sinon.stub(Item, 'find').returns({ sort: sortStub });

      await itemController.getItems(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockItems)).to.be.true;
    });

    it('should return 500 if error', async () => {
      const req = { user: { _id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const sortReject = sinon.stub().rejects(new Error('DB Error'));
      sinon.stub(Item, 'find').returns({ sort: sortReject });

      await itemController.getItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  // ✅ GET ALL ITEMS (ADMIN)
  describe('geAllItems', () => {
    it('should return all items', async () => {
      const mockItems = [{ title: 'Watch' }];

      const sortStub = sinon.stub().resolves(mockItems);
      sinon.stub(Item, 'find').returns({ sort: sortStub });

      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.geAllItems(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockItems)).to.be.true;
    });
  });

  // ✅ GET ITEM BY ID
  describe('getItemById', () => {
    it('should return item by id', async () => {
      const userId = new mongoose.Types.ObjectId();
      const itemId = new mongoose.Types.ObjectId();
      const mockItem = { _id: itemId, title: 'Bag', user_id: userId };

      sinon.stub(Item, 'findOne').resolves(mockItem);

      const req = { params: { id: itemId }, user: { _id: userId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.getItemById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockItem)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findOne').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.getItemById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });
  });

  // ✅ UPDATE ITEM
  describe('updateItem', () => {
    it('should update item successfully', async () => {
      const updatedItem = { title: 'Updated', description: 'Updated desc' };

      sinon.stub(Item, 'findOneAndUpdate').resolves(updatedItem);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
        body: updatedItem,
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.updateItem(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedItem)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findOneAndUpdate').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
        body: { title: 'New' },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.updateItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // ✅ DELETE ITEM
  describe('deleteItem', () => {
    it('should delete item successfully', async () => {
      const item = { title: 'To delete' };
      sinon.stub(Item, 'findOneAndDelete').resolves(item);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.deleteItem(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Item deleted successfully' })).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findOneAndDelete').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.deleteItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
