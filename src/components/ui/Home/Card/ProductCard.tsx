const ProductCard = () => {
  return (
    <div className="card h-100">
      <img
        className="card-img-top"
        src="../../assets/img/elements/2.png"
        alt="Card image cap"
      />
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="javascript:void(0)" className="btn btn-outline-primary">
          Go somewhere
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
