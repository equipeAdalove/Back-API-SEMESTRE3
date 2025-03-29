-- CreateTable
CREATE TABLE "exportacao" (
    "id" SERIAL NOT NULL,
    "co_ano" SMALLINT NOT NULL,
    "co_mes" SMALLINT,
    "co_ncm" VARCHAR(8) NOT NULL,
    "co_unid" VARCHAR(2),
    "co_pais" VARCHAR(3),
    "sg_uf_ncm" VARCHAR(2),
    "co_via" VARCHAR(2),
    "co_urf" VARCHAR(7),
    "qt_estat" DECIMAL(15,2),
    "kg_liquido" DECIMAL(10,3),
    "vl_fob" DECIMAL(15,2),

    CONSTRAINT "exportacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importacao" (
    "id" SERIAL NOT NULL,
    "co_ano" SMALLINT,
    "co_mes" SMALLINT,
    "co_ncm" VARCHAR(8) NOT NULL,
    "co_unid" VARCHAR(2),
    "co_pais" VARCHAR(3),
    "sg_uf_ncm" VARCHAR(2),
    "co_via" VARCHAR(2),
    "co_urf" VARCHAR(7),
    "qt_estat" DECIMAL(12,2),
    "kg_liquido" DECIMAL(10,3),
    "vl_fob" DECIMAL(15,2),
    "vl_frete" DECIMAL(15,2),
    "vl_seguro" DECIMAL(15,2),

    CONSTRAINT "importacao_pkey" PRIMARY KEY ("id")
);
