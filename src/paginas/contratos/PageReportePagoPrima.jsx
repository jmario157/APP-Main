import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ReportePagoPrima } from '../../reportes/contratos/ReportePagoPrima';
import Header from '../../components/plantilla/Header';
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer';
import { Link, useParams } from 'react-router-dom';

function PageReportePagoPrima() {
    const { id } = useParams();
    return (
        <>
            <Header />
            <SideNav />
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Reporte de Pagos</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={"/app/pagos"}>Pagos</Link></li>
                                    <li className="breadcrumb-item active">Reporte de pago</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card card-primary card-outline">
                                    <div className="card-header">
                                        <h3 className="card-title">Pago</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <PDFViewer style={{height:"83vh", width:"100%"}}>
                                            <ReportePagoPrima id={id} />
                                        </PDFViewer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}

export default PageReportePagoPrima;
