-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/10/2026 às 02:34
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `estudio_tatuagem`
--
CREATE DATABASE IF NOT EXISTS `estudio_tatuagem` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `estudio_tatuagem`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `agendamento`
--

CREATE TABLE `agendamento` (
  `idagendamento` int(11) NOT NULL,
  `idcliente` int(11) NOT NULL,
  `idtatuador` int(11) NOT NULL,
  `dataagendamento` date NOT NULL,
  `horaagendamento` time NOT NULL,
  `descricaotatuagem` text DEFAULT NULL,
  `desenhoaprovado` varchar(255) DEFAULT NULL,
  `valortatuagem` decimal(10,2) DEFAULT NULL,
  `status` enum('pendente','confirmado','concluido','cancelado') NOT NULL DEFAULT 'pendente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `agendamento`
--

INSERT INTO `agendamento` (`idagendamento`, `idcliente`, `idtatuador`, `dataagendamento`, `horaagendamento`, `descricaotatuagem`, `desenhoaprovado`, `valortatuagem`, `status`) VALUES
(1, 1, 1, '2025-05-10', '14:00:00', 'Mandala no braço', NULL, 350.00, 'concluido'),
(2, 2, 2, '2025-05-11', '10:00:00', 'Rosa aquarela no ombro', NULL, 200.00, 'confirmado'),
(4, 1, 1, '2026-10-22', '16:00:00', 'Fênix nas costas segurando um arco', NULL, 480.00, 'pendente'),
(5, 4, 1, '2026-10-21', '14:00:00', 'Tatuagem de pato', '5_100 Adorable Duck Tattoos You Will Want To Try - Tattoo Me Now.jpg', 120.00, 'concluido'),
(6, 5, 2, '2026-03-05', '17:00:00', 'Tatuagem de gato', NULL, 200.00, 'pendente'),
(7, 7, 2, '2023-05-16', '14:30:00', 'Coruja grande para tampar tatuagem antiga nas costas.', NULL, 550.00, 'pendente');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `datacadastro` date DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `uf` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`idcliente`, `nome`, `cpf`, `telefone`, `datacadastro`, `cidade`, `uf`) VALUES
(1, 'Ana Costa', '44444444444', '11988880001', '2026-09-23', 'São Paulo', 'SP'),
(2, 'Bruno Costa', '55555555555', '31988880002', '2024-03-22', 'Belo Horizonte', 'MG'),
(4, 'João Henrique', '48952602178', '1198520489', '2026-09-18', 'Jundiaí', 'SP'),
(5, 'Alana', '48915602178', '11985621478', '2026-09-18', 'Jundiaí', 'SP'),
(7, 'Janaina Maria', '78945628512', '11645872302', '2026-09-23', 'Mauá', 'SP');

-- --------------------------------------------------------

--
-- Estrutura para tabela `estilo`
--

CREATE TABLE `estilo` (
  `idestilo` int(11) NOT NULL,
  `descricao` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estilo`
--

INSERT INTO `estilo` (`idestilo`, `descricao`) VALUES
(1, 'Blackwork'),
(2, 'Aquarela'),
(3, 'Realismo'),
(4, 'Old School');

-- --------------------------------------------------------

--
-- Estrutura para tabela `senioridade`
--

CREATE TABLE `senioridade` (
  `idsenioridade` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `senioridade`
--

INSERT INTO `senioridade` (`idsenioridade`, `nome`) VALUES
(1, 'Júnior'),
(2, 'Pleno'),
(3, 'Sênior');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tatuador`
--

CREATE TABLE `tatuador` (
  `idtatuador` int(11) NOT NULL,
  `nometatuador` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `datacontratacao` date DEFAULT NULL,
  `idsenioridade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tatuador`
--

INSERT INTO `tatuador` (`idtatuador`, `nometatuador`, `cpf`, `email`, `telefone`, `datacontratacao`, `idsenioridade`) VALUES
(1, 'Lucas Mendes', '11111111111', 'lucas@estudio.com', '11999990001', '2020-03-01', 3),
(2, 'Carla Souza', '22222222222', 'carla@estudio.com', '11999990002', '2026-09-23', 3),
(3, 'Pedro Lima', '33333333333', 'pedro@estudio.com', '11999990003', '2024-01-10', 1),
(5, 'Alan Silva', '44444444444', 'alan@gmail.com', '11999999004', '2026-09-25', 2),
(8, 'Maria Silva', '98761257485', 'maria@gmail.com', '11485762547', '2026-09-23', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tatuador_estilo`
--

CREATE TABLE `tatuador_estilo` (
  `idtatuador` int(11) NOT NULL,
  `idestilo` int(11) NOT NULL,
  `dataestilo` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tatuador_estilo`
--

INSERT INTO `tatuador_estilo` (`idtatuador`, `idestilo`, `dataestilo`) VALUES
(1, 1, '2026-09-24'),
(1, 3, '2026-09-24'),
(2, 2, '2022-06-15'),
(3, 4, '2024-01-10'),
(5, 1, '2026-09-24'),
(5, 4, '2026-09-24');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('admin','funcionario','cliente') NOT NULL DEFAULT 'funcionario',
  `idcliente` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`idusuario`, `nome`, `email`, `senha`, `tipo`, `idcliente`) VALUES
(1, 'alana', 'alana@gmail.com', '$2b$12$fsKseZhJCivpFtCk3Cy.jeSjPC4srasexGnJKpT0clwV/16OPYI6C', 'funcionario', NULL),
(3, 'joao', 'joao@gmail.com', '$2b$12$79ppkgcN9OTh7CvGBj2tB.YIaQrqgpQCWiJjCO7y6MtRFMfR5CFy.', 'funcionario', NULL),
(5, 'Administrador', 'admin@estudio.com', '$2b$12$sS0YZjaJjknBbd9H83aEie0buCai.gqnSpJ4BvBnH7WlnpuJ5I.o2', 'admin', NULL),
(6, 'teste', 'teste@gmail.com', '$2b$12$qb9ctulDugVVqfAzqSSAOOxuFEcuFSUiCxE8ryBYfSMmqkn/kBa06', 'funcionario', NULL),
(7, 'diogo', 'diogo@gmail.com', '$2b$12$8e61gObz5B5NY7SkPf/4cuzK6i//8i5KZIiY/Eyu/ma0s7I0oyQzm', 'funcionario', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agendamento`
--
ALTER TABLE `agendamento`
  ADD PRIMARY KEY (`idagendamento`),
  ADD KEY `idcliente` (`idcliente`),
  ADD KEY `idtatuador` (`idtatuador`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Índices de tabela `estilo`
--
ALTER TABLE `estilo`
  ADD PRIMARY KEY (`idestilo`);

--
-- Índices de tabela `senioridade`
--
ALTER TABLE `senioridade`
  ADD PRIMARY KEY (`idsenioridade`);

--
-- Índices de tabela `tatuador`
--
ALTER TABLE `tatuador`
  ADD PRIMARY KEY (`idtatuador`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD KEY `idsenioridade` (`idsenioridade`);

--
-- Índices de tabela `tatuador_estilo`
--
ALTER TABLE `tatuador_estilo`
  ADD PRIMARY KEY (`idtatuador`,`idestilo`),
  ADD KEY `idestilo` (`idestilo`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idcliente` (`idcliente`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agendamento`
--
ALTER TABLE `agendamento`
  MODIFY `idagendamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `estilo`
--
ALTER TABLE `estilo`
  MODIFY `idestilo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `senioridade`
--
ALTER TABLE `senioridade`
  MODIFY `idsenioridade` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tatuador`
--
ALTER TABLE `tatuador`
  MODIFY `idtatuador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agendamento`
--
ALTER TABLE `agendamento`
  ADD CONSTRAINT `agendamento_ibfk_1` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`),
  ADD CONSTRAINT `agendamento_ibfk_2` FOREIGN KEY (`idtatuador`) REFERENCES `tatuador` (`idtatuador`);

--
-- Restrições para tabelas `tatuador`
--
ALTER TABLE `tatuador`
  ADD CONSTRAINT `tatuador_ibfk_1` FOREIGN KEY (`idsenioridade`) REFERENCES `senioridade` (`idsenioridade`);

--
-- Restrições para tabelas `tatuador_estilo`
--
ALTER TABLE `tatuador_estilo`
  ADD CONSTRAINT `tatuador_estilo_ibfk_1` FOREIGN KEY (`idtatuador`) REFERENCES `tatuador` (`idtatuador`),
  ADD CONSTRAINT `tatuador_estilo_ibfk_2` FOREIGN KEY (`idestilo`) REFERENCES `estilo` (`idestilo`);

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
