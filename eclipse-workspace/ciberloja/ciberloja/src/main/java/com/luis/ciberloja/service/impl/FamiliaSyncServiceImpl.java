package com.luis.ciberloja.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.luis.ciberloja.model.Familia;
import com.luis.ciberloja.repository.FamiliaRepository;
import com.luis.ciberloja.service.FamiliaSyncService;

@Service
public class FamiliaSyncServiceImpl implements FamiliaSyncService {
	@Autowired
	private FamiliasCiberlojaImpl familiasCiberlojaImpl;

	@Autowired
	private FamiliaRepository familiaRepository;

	@Override
	public void importAllFamilias() {
		try {
			List<Familia> familias = familiasCiberlojaImpl.getFamiliasCiberlojaSite();
			familiaRepository.saveAll(familias);
		} catch (Exception e) {
			throw new RuntimeException("Failed to import all families", e);
		}
	}

	@Override
	public void syncUpdatedFamilias() {
		try {
			List<Familia> familias = familiasCiberlojaImpl.getFamiliasCiberlojaSite();
			for (Familia familia : familias) {
				Familia existing = familiaRepository.findById(familia.getId()).orElse(null);
				if (existing == null) {
					familiaRepository.save(familia);
				} else if (!existing.getDescricao().equals(familia.getDescricao())) {
					existing.setDescricao(familia.getDescricao());
					familiaRepository.save(existing);
				}
			}
		} catch (Exception e) {
			throw new RuntimeException("Failed to sync updated families", e);
		}
	}
}