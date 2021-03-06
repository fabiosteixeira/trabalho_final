import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addOptional, removeOptional } from '../actions';
import { Cars } from "../api/Cars";
import { OptionalCar } from "../Components/OptionalCar";
import { Link } from "react-router-dom";

function OptionalsView(props) {

  const [version] = useState(props.version);
  const [optionals, setOptionals] = useState([]);

  useEffect(() => {

    const LoadOptionals = async () => {
      setOptionals([]);

      Cars.getOptionalsByVersion(version.id).then(
        result => {
          setOptionals(result);
          console.log("Os opcionais disponíveis da versão do carro selecionado (id = " + version.id.toString() + ") foram carregadas com sucesso!");
        }
      )
    }

    if (version !== null && version.id !== null)
      LoadOptionals();
  }, [version]);

  function handleBtnSelectOptional(e, optionalSel) {
    if (props.optionals.find(opt => opt.id === optionalSel.id) === undefined)
      props.addOptional(optionalSel);
    else
      props.removeOptional(optionalSel);
  }

  return (
    <div>
      {version ?
        <div>
          <h2>Escolha os opcionais para o carro</h2>
          <h4>Quantidade selecionada: {props.optionals.length}</h4>
          <Link to='/resume'>
            <span className="finishSel">Finalizar seleção</span>
          </Link>
          {optionals.map((optional, i) =>
            <div key={i}>
              <OptionalCar
                {...optional}
                onSelectOptional={handleBtnSelectOptional}
                selected={props.optionals === null ? false : (props.optionals.find(opt => opt.id === optional.id) === undefined ? false : true)} />
            </div>
          )}
        </div>
        : <h2>É necessário escolher primeiramente uma versão de carro</h2>
      }

      <style jsx>{`
            .finishSel {
              margin-left: 15px;
              text-decoration: none;
              white-space: nowrap;
              display: inline-block;
              border-radius: 5px;
              padding: 10px 15px;
              font-size: 20px;
              color: #fff;
              background-image: linear-gradient(#4f93ce,#285f8f);
              border: 1px solid #285f8f;
            }
        `}</style>
    </div>
  )
}

const mapStateToProps = store => ({
  version: store.carState.version,
  optionals: store.carState.optionals
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addOptional, removeOptional }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OptionalsView);