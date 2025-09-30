// test/item.controller.test.js
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Item = require('../models/Item');
const itemController = require('../controllers/mainController');

describe('Item Controller Tests (Error & Edge Cases Only)', () => {
  afterEach(() => {
    sinon.restore();
  });

  // CREATE ITEM
  describe('createItem', () => {
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
      expect(res.json.called).to.be.true;
    });
  });

  // GET ITEMS (USER)
  describe('getItems', () => {
    it('should return 500 if error', async () => {
      const req = { user: { _id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const sortReject = sinon.stub().rejects(new Error('DB Error'));
      sinon.stub(Item, 'find').returns({ sort: sortReject });

      await itemController.getItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  // GET ALL ITEMS (ADMIN)
  describe('geAllItems', () => {
    it('should return 500 if error', async () => {
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const sortReject = sinon.stub().rejects(new Error('DB Error'));
      sinon.stub(Item, 'find').returns({ sort: sortReject });

      await itemController.geAllItems({}, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  // GET ITEM BY ID
  describe('getItemById', () => {
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

    it('should return 500 if error', async () => {
      sinon.stub(Item, 'findOne').throws(new Error('DB Error'));

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.getItemById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  // UPDATE ITEM
  describe('updateItem', () => {
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

    it('should return 500 if error', async () => {
      sinon.stub(Item, 'findOneAndUpdate').throws(new Error('DB Error'));

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
        body: { title: 'New' },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.updateItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  // DELETE ITEM
  describe('deleteItem', () => {
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

    it('should return 500 if error', async () => {
      sinon.stub(Item, 'findOneAndDelete').throws(new Error('DB Error'));

      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await itemController.deleteItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });
});
